import { AppContext, CSSProperties, StyleValue } from 'vue';
import { ButtonProps } from '../button';
import { RenderContent } from '../_utils/types';
export interface ModalConfig {
    title?: RenderContent;
    content: RenderContent;
    footer?: boolean | RenderContent;
    closable?: boolean;
    okText?: string;
    cancelText?: string;
    okButtonProps?: ButtonProps;
    cancelButtonProps?: ButtonProps;
    okLoading?: boolean;
    hideCancel?: boolean;
    mask?: boolean;
    simple?: boolean;
    maskClosable?: boolean;
    maskStyle?: CSSProperties;
    alignCenter?: boolean;
    escToClose?: boolean;
    draggable?: boolean;
    fullscreen?: boolean;
    onOk?: (e?: Event) => void;
    onCancel?: (e?: Event) => void;
    onBeforeOk?: (done: (closed: boolean) => void) => void | boolean | Promise<void | boolean>;
    onBeforeCancel?: () => boolean;
    onOpen?: () => void;
    onClose?: () => void;
    onBeforeOpen?: () => void;
    onBeforeClose?: () => void;
    width?: number | string;
    top?: number | string;
    titleAlign?: 'start' | 'center';
    renderToBody?: boolean;
    popupContainer?: string | HTMLElement;
    modalClass?: string | any[];
    modalStyle?: CSSProperties;
    maskAnimationName?: string;
    modalAnimationName?: string;
    hideTitle?: boolean;
    bodyClass?: string | any[];
    bodyStyle?: StyleValue;
}
export declare type ModalUpdateConfig = Omit<ModalConfig, 'title' | 'content' | 'footer' | 'onOk' | 'onCancel' | 'onBeforeOk' | 'onBeforeCancel' | 'onOpen' | 'onClose' | 'onBeforeOpen' | 'onBeforeClose'>;
export interface ModalReturn {
    close: () => void;
    update: (config: ModalUpdateConfig) => void;
}
export interface ModalMethod {
    open: (config: ModalConfig, appContext?: AppContext) => ModalReturn;
    confirm: (config: ModalConfig, appContext?: AppContext) => ModalReturn;
    info: (config: ModalConfig, appContext?: AppContext) => ModalReturn;
    success: (config: ModalConfig, appContext?: AppContext) => ModalReturn;
    warning: (config: ModalConfig, appContext?: AppContext) => ModalReturn;
    error: (config: ModalConfig, appContext?: AppContext) => ModalReturn;
}
