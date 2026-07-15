#!/usr/bin/env python3
"""Audit internal links in docs/ for GitHub Pages (Jekyll) publishability."""
from __future__ import annotations

import os
import re
import sys
import urllib.parse
from pathlib import Path

DOCS = Path(__file__).resolve().parent.parent

EXCLUDE_FILES = {
    "Gemfile",
    "Gemfile.lock",
    "README.md",
    "README_CN.md",
}
EXCLUDE_DIRS = {
    "_site",
    "_layouts",
    "_includes",
    "scripts",
    ".jekyll-cache",
    ".sass-cache",
    "done",
    "man",
}


def is_excluded(rel: Path) -> bool:
    parts = rel.parts
    if rel.name in EXCLUDE_FILES:
        return True
    rel_posix = rel.as_posix()
    for exc in EXCLUDE_DIRS:
        if rel_posix == exc or rel_posix.startswith(exc + "/"):
            return True
    return False


def is_published(rel: Path) -> bool:
    if is_excluded(rel):
        return False
    return rel.suffix in {".md", ".html", ".svg", ".css", ".js", ".png", ".jpg", ".gif", ".webp"}


def url_for(rel_md: Path) -> str:
    return "/" + rel_md.with_suffix(".html").as_posix()


def build_published() -> set[str]:
    published: set[str] = {"/index.html"}
    for root, dirs, files in os.walk(DOCS):
        dirs[:] = [
            d
            for d in dirs
            if not d.startswith(".")
            and not any(
                (Path(root, d).relative_to(DOCS).as_posix() + "/").startswith(exc + "/")
                or Path(root, d).relative_to(DOCS).as_posix() == exc
                for exc in EXCLUDE_DIRS
            )
        ]
        for name in files:
            rel = Path(root, name).relative_to(DOCS)
            if not is_published(rel):
                continue
            if rel.suffix == ".md":
                published.add(url_for(rel))
            else:
                published.add("/" + rel.as_posix())
    return published


def resolve(link: str, source: Path) -> str | None:
    if link.startswith(("http://", "https://", "mailto:", "#", "//")):
        return None
    path_part = link.split("#", 1)[0]
    if not path_part:
        return None

    if path_part.startswith("/"):
        target = path_part
    else:
        try:
            rel = (source.parent / path_part).resolve().relative_to(DOCS.resolve())
        except ValueError:
            return None
        target = "/" + rel.as_posix()

    if target.endswith(".md"):
        target = target[:-3] + ".html"
    if target.endswith("/"):
        target += "index.html"
    return target


def exists_on_disk(target: str) -> tuple[bool, bool]:
    rel = target.lstrip("/")
    html = DOCS / rel
    md = DOCS / (rel[:-5] + ".md") if rel.endswith(".html") else DOCS / rel
    return html.exists(), md.exists()


def main() -> int:
    include_todo = "--include-todo" in sys.argv
    active_exclude = set(EXCLUDE_DIRS)
    if include_todo:
        active_exclude.discard("TODO")

    published: set[str] = {"/index.html"}
    for root, dirs, files in os.walk(DOCS):
        dirs[:] = [
            d
            for d in dirs
            if not d.startswith(".")
            and not any(
                (Path(root, d).relative_to(DOCS).as_posix() + "/").startswith(exc + "/")
                or Path(root, d).relative_to(DOCS).as_posix() == exc
                for exc in active_exclude
            )
        ]
        for name in files:
            rel = Path(root, name).relative_to(DOCS)
            if rel.name in EXCLUDE_FILES:
                continue
            rel_posix = rel.as_posix()
            if any(rel_posix == exc or rel_posix.startswith(exc + "/") for exc in active_exclude):
                continue
            if rel.suffix == ".md":
                published.add(url_for(rel))
            elif rel.suffix in {".html", ".svg", ".css", ".js", ".png", ".jpg", ".gif", ".webp", ".txt"}:
                published.add("/" + rel_posix)
    link_re = re.compile(r"\[([^\]]*)\]\(([^)]+)\)")
    href_re = re.compile(r"""href=["']([^"']+)["']""")

    broken: list[tuple] = []
    checked = 0

    def check(source: Path, link: str) -> None:
        nonlocal checked
        if link.startswith("{{") or "{{" in link:
            return
        target = resolve(link, source)
        if target is None:
            return
        checked += 1
        candidates = {target, urllib.parse.unquote(target)}
        if any(c in published for c in candidates):
            return
        html_ok, md_ok = exists_on_disk(target)
        dir_ok = (DOCS / target.lstrip("/")).is_dir()
        if dir_ok:
            return
        in_todo = "/TODO/" in target or target.startswith("/TODO/")
        broken.append((source.relative_to(DOCS).as_posix(), link, target, md_ok, html_ok, in_todo))

    for root, dirs, files in os.walk(DOCS):
        dirs[:] = [d for d in dirs if not d.startswith(".") and d != "_site"]
        for name in files:
            if not name.endswith((".md", ".html")):
                continue
            fp = Path(root, name)
            rel = fp.relative_to(DOCS)
            if is_excluded(rel) and "TODO" not in str(rel):
                continue
            text = fp.read_text(encoding="utf-8", errors="replace")
            for m in link_re.finditer(text):
                check(fp, m.group(2))
            for m in href_re.finditer(text):
                check(fp, m.group(1))

    seen: set[tuple[str, str]] = set()
    unique = []
    for row in broken:
        key = (row[0], row[1])
        if key not in seen:
            seen.add(key)
            unique.append(row)

    print(f"Published pages: {len(published)}")
    print(f"Links checked: {checked}")
    print(f"Broken links: {len(unique)}")
    todo = [r for r in unique if r[5]]
    missing = [r for r in unique if not r[3] and not r[4]]
    excluded_exists = [r for r in unique if (r[3] or r[4]) and r[5]]
    other = [r for r in unique if r not in todo and r not in missing]

    print(f"  -> TODO excluded: {len(todo)}")
    print(f"  -> file missing: {len(missing)}")
    print(f"  -> other: {len(other)}")
    print()

    if missing:
        print("=== Missing files ===")
        for r in sorted(missing):
            print(f"  {r[0]} | {r[1]} -> {r[2]}")
        print()

    if todo and not include_todo:
        print("=== TODO excluded (sample) ===")
        for r in sorted(todo)[:30]:
            print(f"  {r[0]} | {r[1]} -> {r[2]}")
        print()

    if other:
        print("=== Other broken ===")
        for r in sorted(other):
            print(f"  {r[0]} | {r[1]} -> {r[2]} (md={r[3]} html={r[4]})")

    return 1 if unique else 0


if __name__ == "__main__":
    raise SystemExit(main())
