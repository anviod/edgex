import { InjectionKey } from 'vue';
export interface LayoutSiderContext {
    onSiderMount?: (id: string) => void;
    onSiderUnMount?: (id: string) => void;
}
export declare const LayoutSiderInjectionKey: InjectionKey<LayoutSiderContext>;
export interface SiderContext {
    theme: string;
    collapsed: boolean;
    collapsedWidth: string | number;
}
export declare const SiderInjectionKey: InjectionKey<SiderContext>;
