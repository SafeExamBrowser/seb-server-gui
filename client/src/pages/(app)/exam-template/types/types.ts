import { z } from "zod";

export const tableOptionsSchema = z.object({
    page: z.number(),
    itemsPerPage: z.number(),
    sortBy: z.array(
        z.object({
            key: z.string(),
            order: z.enum(["asc", "desc"]),
        }),
    ),
});

export type TableOptions = z.infer<typeof tableOptionsSchema>;
