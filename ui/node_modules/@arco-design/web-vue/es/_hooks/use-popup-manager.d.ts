import { Ref } from 'vue';
export declare type PopupType = 'popup' | 'dialog' | 'message';
export default function usePopupManager(type: PopupType, { visible, runOnMounted, }?: {
    visible?: Ref<boolean>;
    runOnMounted?: boolean;
}): {
    zIndex: Readonly<Ref<number, number>>;
    open: () => void;
    close: () => void;
    isLastDialog: () => boolean;
};
