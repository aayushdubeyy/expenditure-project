import { createSchema } from "graphql-yoga";

import { authTypeDefs } from "../modules/auth/auth.types";
import { authResolver } from "../modules/auth/auth.resolver";

export const schema = createSchema({
    typeDefs: [authTypeDefs],
    resolvers: [authResolver],
});