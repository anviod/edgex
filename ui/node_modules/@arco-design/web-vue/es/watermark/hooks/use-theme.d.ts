import { Ref } from 'vue';
declare const Theme: {
    Dark: "dark";
    Light: "light";
};
export declare const useTheme: (callback?: (() => void) | undefined) => {
    theme: Ref<"dark" | "light", "dark" | "light">;
    setTheme: (value: typeof Theme[keyof typeof Theme]) => void;
};
export {};
