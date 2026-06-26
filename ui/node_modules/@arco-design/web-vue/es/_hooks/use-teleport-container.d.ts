import { Ref } from 'vue';
export declare const useTeleportContainer: ({ popupContainer, visible, defaultContainer, documentContainer, }: {
    popupContainer: Ref<string | HTMLElement | undefined>;
    visible: Ref<boolean>;
    defaultContainer?: string | undefined;
    documentContainer?: boolean | undefined;
}) => {
    teleportContainer: Ref<string | HTMLElement | undefined, string | HTMLElement | undefined>;
    containerRef: Ref<HTMLElement | undefined, HTMLElement | undefined>;
};
