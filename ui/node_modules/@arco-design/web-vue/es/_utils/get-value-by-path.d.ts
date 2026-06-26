import { Data } from './types';
export declare const getValueByPath: <T = any>(obj: Data | undefined, path: string | undefined) => T | undefined;
export declare const setValueByPath: (obj: Data | undefined, path: string | undefined, value: any, { addPath }?: {
    addPath?: boolean | undefined;
}) => void;
