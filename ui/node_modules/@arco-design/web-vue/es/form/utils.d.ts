import { ValidateStatus } from './interface';
export declare function getValueByPath(obj: any, path: string, strict: boolean): {
    o: unknown;
    k: string;
    v: unknown;
};
export declare const getFinalValidateStatus: (validateStatus: Record<string, ValidateStatus | ''>) => "" | "error" | "success" | "warning" | "validating";
export declare const getFinalValidateMessage: (validateMessage: Record<string, string>) => string[];
export declare const getFormElementId: (prefix: string | undefined, field: string) => string;
