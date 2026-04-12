import { lowercaseAndTrimString, validateString } from "./string_operations"

export const validateEmail = (email : unknown) => {
    const validatedEmail = lowercaseAndTrimString(validateString(email));
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(validatedEmail)) {
        throw new Error("Invalid Email Format");
    }

    return validatedEmail;
}