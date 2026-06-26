import type { Slots } from 'vue';
export declare type TabsPosition = 'left' | 'right' | 'top' | 'bottom';
export declare type TabsType = 'line' | 'card' | 'card-gutter' | 'text' | 'rounded' | 'capsule';
export interface TabData {
    key: string | number;
    title?: string;
    disabled?: boolean;
    closable?: boolean;
    slots: Slots;
}
export declare type TabTriggerEvent = 'click' | 'hover';
export declare type ScrollPosition = 'start' | 'end' | 'center' | 'auto' | number;
