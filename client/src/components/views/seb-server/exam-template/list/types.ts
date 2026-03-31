import { z } from "zod";

export const tableOptionsSchema = z.object({
    page: z.number(),
    itemsPerPage: z.number(),
});

export type TableOptions = z.infer<typeof tableOptionsSchema>;
