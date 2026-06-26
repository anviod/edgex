export interface LayoutProps {
    hasSider?: boolean;
}
export interface SiderProps {
    theme?: 'dark' | 'light';
    collapsed?: boolean;
    defaultCollapsed?: boolean;
    collapsible?: boolean;
    width?: number | string;
    collapsedWidth?: number;
    reverseArrow?: boolean;
    breakpoint?: 'xxl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs';
    resizeDirections?: string[];
    hideTrigger?: boolean;
}
