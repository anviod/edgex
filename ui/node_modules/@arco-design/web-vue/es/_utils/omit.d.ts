import type { Data } from './types';
export declare const omit: <T extends Data, K extends string | number | symbol>(object: T, path: K[]) => Omit<T, K>;
