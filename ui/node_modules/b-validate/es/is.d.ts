export declare function isArray(obj: any): obj is any[];
export declare function isObject(obj: any): obj is {
    [key: string]: any;
};
export declare function isString(obj: any): obj is string;
export declare function isNumber(obj: any): obj is number;
export declare function isRegExp(obj: any): obj is RegExp;
export declare function isBoolean(obj: any): obj is boolean;
export declare function isUndefined(obj: any): obj is undefined;
export declare function isFunction(obj: any): obj is (...args: any[]) => any;
export declare function isEmptyObject(obj: any): boolean;
export declare function isEmptyValue(obj: any): boolean;
export declare function isEmptyArray(obj: any): boolean;
export declare const isEqual: (obj: any, other: any) => boolean;
