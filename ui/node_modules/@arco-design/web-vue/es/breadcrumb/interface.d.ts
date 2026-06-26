export interface BreadcrumbRoute {
    label: string;
    path: string;
    children?: {
        label: string;
        path: string;
    }[];
}
