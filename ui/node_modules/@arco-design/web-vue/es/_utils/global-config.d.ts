import type { App } from 'vue';
import type { ArcoOptions } from './types';
export declare const getComponentPrefix: (options?: ArcoOptions | undefined) => string;
export declare const setGlobalConfig: (app: App, options?: ArcoOptions | undefined) => void;
export declare const getPrefixCls: (componentName?: string | undefined) => string;
