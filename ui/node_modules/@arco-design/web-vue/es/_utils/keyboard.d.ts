export declare const KEYBOARD_KEY: {
    ENTER: string;
    ESC: string;
    BACKSPACE: string;
    TAB: string;
    SPACE: string;
    ARROW_UP: string;
    ARROW_DOWN: string;
    ARROW_LEFT: string;
    ARROW_RIGHT: string;
};
export interface CodeKey {
    key: string;
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    meta?: boolean;
}
export declare const getKeyDownHandler: (codeKeyMap: Map<string | CodeKey, (e: Event) => void>) => (event: KeyboardEvent) => void;
