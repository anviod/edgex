export interface WatermarkFont {
    color?: string;
    fontSize?: number;
    fontFamily?: string;
    fontStyle?: 'none' | 'normal' | 'italic' | 'oblique';
    textAlign?: 'start' | 'end' | 'left' | 'right' | 'center';
    fontWeight?: 'normal' | 'bold' | 'bolder' | 'lighter' | number;
}
