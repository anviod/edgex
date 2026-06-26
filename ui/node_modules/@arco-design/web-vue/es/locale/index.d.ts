import type { ArcoI18nMessages, ArcoLang } from './interface';
export declare const addI18nMessages: (messages: ArcoI18nMessages, options?: {
    overwrite?: boolean | undefined;
} | undefined) => void;
export declare const useLocale: (locale: string) => void;
export declare const getLocale: () => string;
export declare const useI18n: () => {
    i18nMessage: import("vue").ComputedRef<ArcoLang>;
    locale: import("vue").ComputedRef<string>;
    t: (key: string, ...args: any[]) => string;
};
