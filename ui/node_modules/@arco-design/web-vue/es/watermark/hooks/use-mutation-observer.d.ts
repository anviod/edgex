import { Ref, ComponentPublicInstance } from 'vue';
export declare const defaultWindow: (Window & typeof globalThis) | undefined;
export interface MutationObserverOptions extends MutationObserverInit {
    window?: Window;
}
export declare type MaybeRef<T> = T | Ref<T>;
export declare type MaybeElement = HTMLElement | SVGElement | ComponentPublicInstance | undefined | null;
export declare type UnRefElementReturn<T extends MaybeElement = MaybeElement> = T extends ComponentPublicInstance ? Exclude<MaybeElement, ComponentPublicInstance> : T | undefined;
export declare type Fn = () => void;
export declare function unrefElement<T extends MaybeElement>(elRef: MaybeRef<T>): UnRefElementReturn<T>;
export declare function tryOnScopeDispose(fn: Fn): boolean;
export declare function useMutationObserver(target: MaybeRef<MaybeElement>, callback: MutationCallback, options?: MutationObserverOptions): {
    isSupported: boolean | undefined;
    stop: () => void;
};
export declare type UseMutationObserverReturn = ReturnType<typeof useMutationObserver>;
