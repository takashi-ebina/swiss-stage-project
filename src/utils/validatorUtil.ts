const checkLength = (maxLength: number) => {
    return (value: string) => value.length <= maxLength || `最大 ${maxLength} 文字です`;
};

export const validatorUtil = {
    checkOrganizationLength: checkLength(30),
    checkNameLength: checkLength(20),
    checkTitleLength: checkLength(30)
};

