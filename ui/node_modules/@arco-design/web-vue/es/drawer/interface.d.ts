import { AppContext, CSSProperties } from 'vue';
import { ButtonProps } from '../button';
import { RenderContent } from '../_utils/types';
export interface DrawerConfig {
    placement?: 'top' | 'right' | 'bottom' | 'left';
    title?: RenderContent;
    content: RenderContent;
    mask?: boolean;
    maskClosable?: boolean;
    closable?: boolean;
    okText?: string;
    cancelText?: string;
    okLoading?: boolean;
    okButtonProps?: ButtonProps;
    cancelButtonProps?: ButtonProps;
    width?: number | string;
    height?: number | string;
    popupContainer?: string | HTMLElement;
    drawerStyle?: CSSProperties;
    onOk?: (e?: Event) => void;
    onCancel?: (e?: Event) => void;
    onBeforeOk?: (done: (closed: boolean) => void) => void | boolean | Promise<void | boolean>;
    onBeforeCancel?: () => boolean;
    onOpen?: () => void;
    onClose?: () => void;
    onBeforeOpen?: () => void;
    onBeforeClose?: () => void;
    escToClose?: boolean;
    header?: boolean | RenderContent;
    footer?: boolean | RenderContent;
    hideCancel?: boolean;
}
export declare type DrawerUpdateConfig = Omit<DrawerConfig, 'title' | 'content' | 'onOk' | 'onCancel' | 'onBeforeOk' | 'onBeforeCancel' | 'onOpen' | 'onClose' | 'onBeforeOpen' | 'onBeforeClose' | 'header' | 'footer'>;
export interface DrawerReturn {
    close: () => void;
    update: (config: DrawerUpdateConfig) => void;
}
export interface DrawerMethod {
    open: (config: DrawerConfig, appContext?: AppContext) => DrawerReturn;
}
