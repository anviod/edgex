import type { App, AppContext } from 'vue';
import { NotificationConfig } from './interface';
declare const Notification: {
    install: (app: App) => void;
    _context: AppContext | null;
    info: (config: string | NotificationConfig, appContext?: AppContext | undefined) => import("./interface").NotificationReturn;
    success: (config: string | NotificationConfig, appContext?: AppContext | undefined) => import("./interface").NotificationReturn;
    warning: (config: string | NotificationConfig, appContext?: AppContext | undefined) => import("./interface").NotificationReturn;
    error: (config: string | NotificationConfig, appContext?: AppContext | undefined) => import("./interface").NotificationReturn;
    remove: (id: string) => void;
    clear: (position?: "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | undefined) => void;
};
export type { NotificationMethod, NotificationConfig, NotificationReturn, } from './interface';
export default Notification;
