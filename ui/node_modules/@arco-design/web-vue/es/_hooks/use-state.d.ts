import { Ref } from 'vue';
export default function useState<T>(defaultValue?: T): [Ref<T>, (newValue: T) => void];
