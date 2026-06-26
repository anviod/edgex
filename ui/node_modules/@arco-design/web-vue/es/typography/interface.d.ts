import { VNode } from 'vue';
export interface EllipsisConfig {
    rows?: number;
    expandable?: boolean;
    ellipsisStr?: string;
    suffix?: string;
    showTooltip?: boolean | {
        type: 'tooltip' | 'popover';
        props: Record<string, any>;
    };
    css?: boolean;
}
export interface EllipsisInternalConfig extends Required<EllipsisConfig> {
    showTooltip: boolean;
    TooltipComponent: any;
    tooltipProps: {
        [key: string]: any;
    };
}
export interface EllipsisProps {
    ellipsis: boolean | EllipsisConfig;
}
export interface CopyProps {
    copyable: boolean;
    copyDelay: number;
    copyText: string | undefined;
}
export interface EditProps {
    editable: boolean;
    editing: boolean | undefined;
    defaultEditing: boolean;
    editText: string | undefined;
}
export declare type OperationsProps = CopyProps & EditProps & EllipsisProps;
export interface BaseProps extends OperationsProps {
    type: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | undefined;
    bold: boolean;
    mark: boolean | {
        color: string;
    };
    underline: boolean;
    delete: boolean;
    code: boolean;
    disabled: boolean;
}
export interface TitleProps extends BaseProps {
    heading: 1 | 2 | 3 | 4 | 5 | 6;
}
export interface ParagraphProps extends BaseProps {
    blockquote: boolean;
    spacing: 'default' | 'close';
}
export interface TextProps extends BaseProps {
    icon?: VNode;
}
