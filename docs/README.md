# EdgeX 文档 GitHub Pages 站点

## 简介

这是 EdgeX 项目的文档 GitHub Pages 站点，用于展示项目的所有文档。

## 站点结构

- `index.md` - 站点首页
- `_config.yml` - 站点配置文件
- `.gitignore` - Git 忽略文件
- `API/` - API 文档目录
- `man/` - 用户手册目录
- `img/` - 图片资源目录

## 本地预览

要在本地预览 GitHub Pages 站点，需要安装 Jekyll：

1. 安装 Ruby 和 RubyGems
2. 安装 Jekyll 和 bundler：
   ```bash
   gem install bundler jekyll
   ```
3. 在 docs 目录中运行：
   ```bash
   bundle install
   bundle exec jekyll serve
   ```
4. 打开浏览器访问 `http://localhost:4000`

## 部署

GitHub Pages 会自动从 `docs` 目录构建站点。要部署更新：

1. 提交更改到 GitHub 仓库
2. 等待 GitHub Actions 完成构建
3. 访问 `https://[username].github.io/[repository]` 查看站点

## 贡献

如果您想贡献文档，请：

1. Fork 仓库
2. 进行更改
3. 提交 Pull Request

## 联系我们

如有任何问题或建议，请通过 GitHub Issues 与我们联系。
