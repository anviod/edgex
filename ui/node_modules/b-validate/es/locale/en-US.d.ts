declare const _default: {
    required: string;
    type: {
        ip: string;
        email: string;
        url: string;
        string: string;
        number: string;
        array: string;
        object: string;
        boolean: string;
    };
    number: {
        min: string;
        max: string;
        equal: string;
        range: string;
        positive: string;
        negative: string;
    };
    string: {
        maxLength: string;
        minLength: string;
        length: string;
        match: string;
        uppercase: string;
        lowercase: string;
    };
    array: {
        length: string;
        minLength: string;
        maxLength: string;
        includes: string;
        deepEqual: string;
        empty: string;
    };
    object: {
        deepEqual: string;
        hasKeys: string;
        empty: string;
    };
    boolean: {
        true: string;
        false: string;
    };
};
export default _default;
