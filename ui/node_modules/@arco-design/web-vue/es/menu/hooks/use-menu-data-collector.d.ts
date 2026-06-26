import { MenuData } from '../interface';
export declare function useMenuDataCollectorContext(isRoot?: boolean): Readonly<{
    collectSubMenu: (key: string, children: MenuData, isReport?: boolean | undefined) => void;
    removeSubMenu: (key: string) => void;
    collectMenuItem: (key: string) => void;
    removeMenuItem: (keys: string) => void;
    reportMenuData: (data: MenuData) => void;
}> | undefined;
export default function useMenuDataCollector(props: {
    key?: string | undefined;
    type: 'menu' | 'popupMenu' | 'subMenu';
}): {
    menuData: import("vue").Ref<{
        key: string;
        children?: any[] | undefined;
    }[], MenuData | {
        key: string;
        children?: any[] | undefined;
    }[]>;
    subMenuKeys: import("vue").ComputedRef<string[]>;
    menuItemKeys: import("vue").ComputedRef<string[]>;
};
