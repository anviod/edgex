import { InjectionKey } from 'vue';
export interface CarouselContext {
    items: number[];
    slideTo: (info: {
        targetIndex: number;
        isNegative: boolean;
        isManual: boolean;
    }) => void;
    mergedIndexes: {
        mergedIndex: number;
        mergedPrevIndex: number;
        mergedNextIndex: number;
    };
    previousIndex: number | undefined;
    animationName: string;
    slideDirection: string | undefined;
    transitionTimingFunction: string;
    moveSpeed: number;
}
export declare const carouselInjectionKey: InjectionKey<CarouselContext>;
