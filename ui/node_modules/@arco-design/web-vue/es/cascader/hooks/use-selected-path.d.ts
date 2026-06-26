import { ComputedRef, Ref } from 'vue';
import { CascaderOptionInfo } from '../interface';
export declare const useSelectedPath: (options: Ref<CascaderOptionInfo[]>, { optionMap, filteredLeafOptions, showSearchPanel, expandChild, }: {
    optionMap: Map<string, CascaderOptionInfo>;
    filteredLeafOptions: ComputedRef<CascaderOptionInfo[]>;
    showSearchPanel?: ComputedRef<boolean> | undefined;
    expandChild: Ref<boolean>;
}) => {
    activeKey: Ref<string | undefined, string | undefined>;
    activeOption: ComputedRef<CascaderOptionInfo | undefined>;
    selectedPath: Ref<string[], string[]>;
    displayColumns: ComputedRef<CascaderOptionInfo[][]>;
    setActiveKey: (key?: string | undefined) => void;
    setSelectedPath: (key?: string | undefined) => void;
    getNextActiveNode: (direction: 'next' | 'preview') => CascaderOptionInfo | undefined;
};
