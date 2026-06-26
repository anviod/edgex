import { TagProps } from '../tag';
import { FieldString } from '../_utils/types';
export interface TagData {
    value?: string | number;
    label?: string;
    closable?: boolean;
    tagProps?: TagProps;
    [other: string]: any;
}
export declare type InputTagFieldNames = FieldString<TagData>;
export interface TagDataInfo extends TagData {
    raw: Record<string, unknown>;
    value: string | number;
    label: string;
    closable: boolean;
}
