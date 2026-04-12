export const validateString = (arg : unknown) => {
    if (typeof arg !== 'string') throw new Error("Passed argument is not a valid string");
    return arg;
}

export const lowercaseAndTrimString = (args : string) => {
    args = validateString(args);
    return args.trim().toLowerCase();
}

export const trimString = (args : string) => {
    args = validateString(args);
    return args.trim();
}