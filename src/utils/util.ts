const isNullOrUndefined = (value: any | null | undefined): boolean => {
    return value === null || value === undefined;
}

export const util = {
    isNullOrUndefined
};
