export declare const TAG_COLORS: readonly ["red", "orangered", "orange", "gold", "lime", "green", "cyan", "blue", "arcoblue", "purple", "pinkpurple", "magenta", "gray"];
export declare type TagColor = typeof TAG_COLORS[number];
export interface TagProps {
    color?: TagColor | string;
    size?: 'small' | 'medium' | 'large';
    visible?: boolean;
    defaultVisible?: boolean;
    loading?: boolean;
    closable?: boolean;
    checkable?: boolean;
    checked?: boolean;
    defaultChecked?: boolean;
}
