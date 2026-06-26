import { InjectionKey, VNodeTypes } from 'vue';
import { InternalMenuProps, MenuData } from './interface';
export declare const MenuInjectionKey: InjectionKey<MenuContext>;
export declare type MenuContext = Readonly<Pick<InternalMenuProps, 'mode' | 'theme' | 'levelIndent' | 'autoScrollIntoView' | 'scrollConfig' | 'inTrigger' | 'triggerProps' | 'tooltipProps' | 'popupMaxHeight'> & {
    selectedKeys: string[];
    openKeys: string[];
    prefixCls: string;
    collapsed: boolean;
    expandIconDown?: () => VNodeTypes;
    expandIconRight?: () => VNodeTypes;
    onSubMenuClick?: (key: string, level: number) => void;
    onMenuItemClick?: (key: string) => void;
}>;
export declare const LevelInjectionKey: InjectionKey<LevelContext>;
export declare type LevelContext = Readonly<{
    level: number;
}>;
export declare type MenuMapType = Map<string, string[]>;
export declare const DataCollectorInjectionKey: InjectionKey<DataCollectorContext>;
export declare type DataCollectorContext = Readonly<{
    collectSubMenu: (key: string, children: MenuData, isReport?: boolean) => void;
    removeSubMenu: (key: string) => void;
    collectMenuItem: (key: string) => void;
    removeMenuItem: (keys: string) => void;
    reportMenuData: (data: MenuData) => void;
}>;
