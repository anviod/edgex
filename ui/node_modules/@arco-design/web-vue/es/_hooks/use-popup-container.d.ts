import { ComputedRef } from 'vue';
interface PopupContainerProps {
    popupContainer: string | HTMLElement | undefined;
}
export default function usePopupContainer(defaultPopupContainer: HTMLElement, props: PopupContainerProps): ComputedRef<HTMLElement>;
export {};
