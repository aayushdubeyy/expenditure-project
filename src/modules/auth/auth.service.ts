import bcrypt from "bcrypt";
import { generateToken } from "../../utils/auth";
import { prisma } from "../../lib/prisma";

export const signupService = async (name: string, email: string, password: string) => {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new Error("User already exists");

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashed,
        },
    });
    const token = generateToken(user.id);

    return { user, token };
};

export const loginService = async (email: string, password: string) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("Invalid credentials");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Invalid credentials");

    const token = generateToken(user.id);
    return { user, token };
};