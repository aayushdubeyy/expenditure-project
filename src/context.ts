import { prisma } from "./lib/prisma";
import { verifyToken } from "./utils/auth";

export const createContext = ({ request }: any) => {
    const authHeader = request.headers.get("authorization");
    let userId: string | null = null;

    if (authHeader?.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        try {
            const decoded = verifyToken(token);
            userId = decoded.userId;
        } catch {}
    }
    return { prisma, userId };
};