import type { App, RenderFunction } from 'vue';
import { VNode } from 'vue';
export interface ArcoOptions {
    classPrefix?: string;
    componentPrefix?: string;
}
export interface ArcoIconOptions {
    iconPrefix?: string;
}
export interface ArcoGlobalConfig {
    classPrefix?: string;
}
declare type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
export declare type BaseType = string | number;
export declare type UnionType = BaseType | Record<string, any>;
export declare type Data = Record<string, any>;
export declare type RenderContent = string | RenderFunction;
export declare type EmitFn<T> = (event: T, ...args: any[]) => void;
export declare type EmitFn2<Options = Record<string, any>, Event extends keyof Options = keyof Options> = UnionToIntersection<{
    [key in Event]: Options[key] extends (...args: infer Args) => any ? (event: key, ...args: Args) => void : (event: key, ...args: any[]) => void;
}[Event]>;
export declare type EmitType<T> = T | T[];
export declare type SFCWithInstall<T, D = Record<string, never>> = T & D & {
    install: (app: App, opt?: ArcoOptions) => void;
};
export declare type ClassName = string | Record<string, boolean> | (string | Record<string, boolean>)[];
export declare type FieldString<T> = {
    [K in keyof T]?: string;
};
export interface SlotChildren {
    value?: VNode[];
}
export interface ValueData {
    value: string | number;
    label: string;
    closable?: boolean;
    [other: string]: any;
}
export declare type AnimationDuration = number | {
    enter: number;
    leave: number;
};
export {};
