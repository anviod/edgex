import type { InjectionKey } from 'vue';
export interface TriggerContext {
    onMouseenter: (ev: MouseEvent) => void;
    onMouseleave: (ev: MouseEvent) => void;
    addChildRef: (ref: any) => void;
    removeChildRef: (ref: any) => void;
}
export declare const triggerInjectionKey: InjectionKey<TriggerContext>;
