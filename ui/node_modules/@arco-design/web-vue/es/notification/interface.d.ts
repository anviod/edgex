import { AppContext, CSSProperties, RenderFunction } from 'vue';
import { ClassName, RenderContent } from '../_utils/types';
import { MessageType } from '../_utils/constant';
export declare const NOTIFICATION_POSITION: readonly ["topLeft", "topRight", "bottomLeft", "bottomRight"];
export declare type NotificationPosition = typeof NOTIFICATION_POSITION[number];
export interface NotificationMethod {
    info: (config: string | NotificationConfig, appContext?: AppContext) => NotificationReturn;
    success: (config: string | NotificationConfig, appContext?: AppContext) => NotificationReturn;
    warning: (config: string | NotificationConfig, appContext?: AppContext) => NotificationReturn;
    error: (config: string | NotificationConfig, appContext?: AppContext) => NotificationReturn;
    remove: (id: string) => void;
    clear: (position?: NotificationPosition) => void;
}
export interface NotificationConfig {
    content: RenderContent;
    title?: RenderContent;
    icon?: RenderFunction;
    id?: string;
    style?: CSSProperties;
    class?: ClassName;
    position?: NotificationPosition;
    showIcon?: boolean;
    closable?: boolean;
    duration?: number;
    footer?: RenderFunction;
    closeIcon?: RenderFunction;
    closeIconElement?: RenderFunction;
    onClose?: (id: number | string) => void;
}
export interface NotificationReturn {
    close: () => void;
}
export interface NotificationItem {
    id: number | string;
    type: MessageType;
    content: RenderContent;
    style?: CSSProperties;
    class?: ClassName;
    title?: RenderContent;
    icon?: RenderFunction;
    footer?: RenderFunction;
    closeIcon?: RenderFunction;
    closeIconElement?: RenderFunction;
    showIcon?: boolean;
    closable?: boolean;
    duration?: number;
    resetOnUpdate?: boolean;
    onClose?: (id: number | string) => void;
}
