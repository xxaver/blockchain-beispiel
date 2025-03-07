import {z, ZodObject} from "zod";

const transaction = z.object({
    data: z.object({
        id: z.number(),
        from: z.string(),
        to: z.string(),
        amount: z.number(),
        fee: z.number(),
        message: z.string()
    }),
    signature: z.string(),
    publicKey: z.string(),
})
export const knownEvents: Record<string, ZodObject<any>> = {
    block: z.object({
        id: z.number(),
        prevHash: z.string(),
        mined: z.object({
            proofOfWork: z.number(),
            publicKey: z.string(),
        }),
        data: z.any(transaction)
    }),
    transaction,
    discover: z.object({}),
    join: z.object({
        name: z.string(),
        publicKey: z.string(),
        computationalPower: z.number(),
    }),
}