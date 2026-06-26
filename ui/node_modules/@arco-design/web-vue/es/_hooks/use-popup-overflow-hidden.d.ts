interface PopupOverflowHiddenProps {
    container: HTMLElement | undefined;
    hidden: boolean;
}
export default function usePopupOverflowHidden(props: PopupOverflowHiddenProps): (() => void)[];
export {};
