import { MenuData } from '../interface';
interface MenuOpenStateProps {
    modelValue: string[] | undefined;
    defaultValue: string[] | undefined;
    autoOpen: boolean;
    autoOpenSelected: boolean;
    selectedKeys: string[];
    subMenuKeys: string[];
    menuData: MenuData;
    accordion: boolean;
}
export default function useMenuOpenState(props: MenuOpenStateProps): {
    openKeys: import("vue").ComputedRef<string[]>;
    localOpenKeys: import("vue").Ref<string[], string[]>;
    setOpenKeys: (val: string[]) => void;
    open(key: string, level: number): string[];
};
export {};
