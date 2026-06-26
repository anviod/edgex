import { AppContext, RenderFunction } from 'vue';
import { RenderContent } from '../_utils/types';
import { MessageType } from '../_utils/constant';
export declare const MESSAGE_POSITION: readonly ["top", "bottom"];
export declare type MessagePosition = typeof MESSAGE_POSITION[number];
export interface MessageMethod {
    info: (config: string | MessageConfig, appContext?: AppContext) => MessageReturn;
    success: (config: string | MessageConfig, appContext?: AppContext) => MessageReturn;
    warning: (config: string | MessageConfig, appContext?: AppContext) => MessageReturn;
    error: (config: string | MessageConfig, appContext?: AppContext) => MessageReturn;
    loading: (config: string | MessageConfig, appContext?: AppContext) => MessageReturn;
    normal: (config: string | MessageConfig, appContext?: AppContext) => MessageReturn;
    clear: (position?: MessagePosition) => void;
}
export interface MessageConfig {
    content: RenderContent;
    id?: string;
    icon?: RenderFunction;
    position?: MessagePosition;
    showIcon?: boolean;
    closable?: boolean;
    duration?: number;
    onClose?: (id: number | string) => void;
    resetOnHover?: boolean;
}
export interface MessageReturn {
    close: () => void;
}
export interface MessageItem {
    id: number | string;
    content: RenderContent;
    type?: MessageType | 'loading' | 'normal';
    icon?: RenderFunction;
    showIcon?: boolean;
    closable?: boolean;
    duration?: number;
    resetOnUpdate?: boolean;
    onClose?: (id: number | string) => void;
    resetOnHover?: boolean;
}
