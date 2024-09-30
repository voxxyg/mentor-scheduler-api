import { z, ZodType } from "zod";

export class UserValidation {

    static readonly REGISTER: ZodType = z.object({
        email: z.string().email().min(1).max(100),
        password: z.string().min(1).max(100),
        name: z.string().min(1).max(100),
        phone: z.string().min(1).max(20),
        role: z.enum(["student", "mentor"])
    });
}