declare const _default: {
    required: string;
    type: {
        string: string;
        number: string;
        boolean: string;
        array: string;
        object: string;
        url: string;
        email: string;
        ip: string;
    };
    number: {
        min: string;
        max: string;
        equal: string;
        range: string;
        positive: string;
        negative: string;
    };
    array: {
        length: string;
        minLength: string;
        maxLength: string;
        includes: string;
        deepEqual: string;
        empty: string;
    };
    string: {
        minLength: string;
        maxLength: string;
        length: string;
        match: string;
        uppercase: string;
        lowercase: string;
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
