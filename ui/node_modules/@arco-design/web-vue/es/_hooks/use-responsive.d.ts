import { Ref } from 'vue';
import { Breakpoint } from '../_utils/responsive-observe';
export declare function useResponsive(breakpoint: Breakpoint | undefined | Ref<Breakpoint | undefined>, callback: (checked: boolean) => void): void;
