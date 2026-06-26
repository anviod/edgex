import { RenderContent } from '../_utils/types';
export interface RadioOption {
    label?: RenderContent;
    value: string | number;
    disabled?: boolean;
}
