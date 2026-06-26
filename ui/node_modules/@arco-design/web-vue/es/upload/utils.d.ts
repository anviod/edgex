import { FileItem, FileStatus, RequestOption, UploadRequest } from './interfaces';
export declare const getProgressStatus: (status?: FileStatus | undefined) => "normal" | "success" | "danger";
export declare const processFileList: (fileList?: FileItem[] | undefined) => FileItem[];
export declare const uploadRequest: ({ fileItem, action, name: originName, data: originData, headers, withCredentials, onProgress, onSuccess, onError, }: RequestOption) => UploadRequest;
export declare const loopDirectory: (itemList: DataTransferItemList, accept: string | undefined, callback: (files: File[]) => void) => void;
export declare const isImage: (file: File) => boolean;
export declare const getFiles: (fileList?: FileList | undefined, accept?: string | undefined) => File[];
