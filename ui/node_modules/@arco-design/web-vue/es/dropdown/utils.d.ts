import { VNode } from 'vue';
import { DropdownOption, DGroup, DSubmenu } from './interface';
export declare const isGroup: (option: DropdownOption) => option is DGroup;
export declare const isSubmenu: (option: DropdownOption) => option is DSubmenu;
export declare const travelDropDownChildren: (children: VNode[]) => DropdownOption[];
