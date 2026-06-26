declare type ZoomType = 'zoomIn' | 'zoomOut';
export declare const minScale: number;
export declare const maxScale: number;
export default function getScale(cur?: number, type?: ZoomType): number;
export declare function getScaleByRate(scale: number, rate?: number, type?: ZoomType): number;
export {};
