import { validateEmail } from "../../utils/email";
import { validateString } from "../../utils/string_operations";
import { signupService, loginService } from "./auth.service";

export const authResolver = {
    Mutation: {
        signup: async (_: any, args: any) => {
            const name = validateString(args.name);
            const email = validateEmail(args.email);
            const password = validateString(args.password);
            return signupService(name, email, password);
        },

        login: async (_: any, args: any) => {
            const email = validateEmail(args.email);
            const password = validateString(args.password);
            return loginService(email, password);
        },
    },
};