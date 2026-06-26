import { Ref, ComputedRef } from 'vue';
export default function useMergeState<T, E = T | undefined>(defaultValue: T, props: {
    value: E;
}): [ComputedRef<T>, (val: E) => void, Ref<T>];
