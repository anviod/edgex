import { RenderContent } from '../_utils/types';
export interface CheckboxOption {
    label?: RenderContent;
    value: string | number;
    disabled?: boolean;
    indeterminate?: boolean;
}
