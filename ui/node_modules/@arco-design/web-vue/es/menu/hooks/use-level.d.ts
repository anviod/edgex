import { Ref } from 'vue';
export declare function provideLevel(level: Ref<number> | number): void;
export default function useLevel(props?: {
    provideNextLevel?: boolean;
}): {
    level: import("vue").ComputedRef<number>;
};
