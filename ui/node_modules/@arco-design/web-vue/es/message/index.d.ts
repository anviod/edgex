import type { App, AppContext } from 'vue';
import { MessageConfig } from './interface';
declare const Message: {
    install: (app: App) => void;
    _context: AppContext | null;
    info: (config: string | MessageConfig, appContext?: AppContext | undefined) => import("./interface").MessageReturn;
    success: (config: string | MessageConfig, appContext?: AppContext | undefined) => import("./interface").MessageReturn;
    warning: (config: string | MessageConfig, appContext?: AppContext | undefined) => import("./interface").MessageReturn;
    error: (config: string | MessageConfig, appContext?: AppContext | undefined) => import("./interface").MessageReturn;
    loading: (config: string | MessageConfig, appContext?: AppContext | undefined) => import("./interface").MessageReturn;
    normal: (config: string | MessageConfig, appContext?: AppContext | undefined) => import("./interface").MessageReturn;
    clear: (position?: "top" | "bottom" | undefined) => void;
};
export type { MessageMethod, MessageConfig, MessageReturn } from './interface';
export default Message;
