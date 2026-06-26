import { InjectionKey } from 'vue';
export declare type PreviewGroupContext = Readonly<{
    registerImageUrl: (id: number, url: string, canPreview: boolean) => () => void;
    preview: (imageId: number) => void;
}>;
export declare const PreviewGroupInjectionKey: InjectionKey<PreviewGroupContext>;
