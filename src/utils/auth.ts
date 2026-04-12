import jwt from "jsonwebtoken";
import ms from "ms";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN as ms.StringValue || "7d";

export const generateToken = (userId : string) => {
    return jwt.sign({ userId }, JWT_SECRET, {
        expiresIn : JWT_EXPIRES_IN
    })
}

export const verifyToken = (token : string) => {
    return jwt.verify(token, JWT_SECRET) as { userId : string };
};