export declare const STEPS_TYPES: readonly ["default", "arrow", "dot", "navigation"];
export declare type StepsType = typeof STEPS_TYPES[number];
export declare const STEP_STATUSES: readonly ["wait", "process", "finish", "error"];
export declare type StepStatus = typeof STEP_STATUSES[number];
export interface StepData {
    step: number;
    status: StepStatus;
}
