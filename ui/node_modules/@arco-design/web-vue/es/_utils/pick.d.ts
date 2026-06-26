export default function pick<T extends object, K extends keyof T>(obj: T, keys: Array<K | string>): Pick<T, K>;
