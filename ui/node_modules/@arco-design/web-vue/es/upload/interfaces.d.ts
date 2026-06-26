import type { RenderFunction, VNode } from 'vue';
export declare type ListType = 'text' | 'picture' | 'picture-card';
export declare type FileStatus = 'init' | 'uploading' | 'done' | 'error';
export interface FileItem {
    uid: string;
    status?: FileStatus;
    file?: File;
    percent?: number;
    response?: any;
    url?: string;
    name?: string;
}
export interface CustomIcon {
    startIcon?: RenderFunction;
    cancelIcon?: RenderFunction;
    retryIcon?: RenderFunction;
    successIcon?: RenderFunction;
    errorIcon?: RenderFunction;
    removeIcon?: RenderFunction;
    previewIcon?: RenderFunction;
    fileIcon?: (fileItem: FileItem) => VNode;
    fileName?: (fileItem: FileItem) => string | VNode;
}
export interface RequestOption {
    action?: string;
    headers?: Record<string, string>;
    name?: string | ((fileItem: FileItem) => string);
    fileItem: FileItem;
    data?: Record<string, string | Blob> | ((fileItem: FileItem) => Record<string, string | Blob>);
    withCredentials?: boolean;
    onProgress: (percent: number, event?: ProgressEvent) => void;
    onSuccess: (response?: any) => void;
    onError: (response?: any) => void;
}
export interface UploadRequest extends Record<string, unknown> {
    abort?: () => void;
}
