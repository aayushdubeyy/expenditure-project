import "dotenv/config"; 
import express from "express";
import { createYoga } from "graphql-yoga";
import cors from "cors";
import { schema } from "./schema";
import { createContext } from "./context";
const app = express();

app.use(cors());

const yoga = createYoga({
    schema,
    context: createContext
});

app.use("/graphql", yoga);

app.listen(4000, () => {
    console.log("🚀 Server running at http://localhost:4000/graphql");
});