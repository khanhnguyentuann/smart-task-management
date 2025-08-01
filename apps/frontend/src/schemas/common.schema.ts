import { z } from 'zod';

export const paginationSchema = z.object({
    page: z.number().int().positive().default(1),
    pageSize: z.number().int().positive().default(20),
    total: z.number().int().nonnegative().optional(),
});

export const sortSchema = z.object({
    field: z.string(),
    order: z.enum(['asc', 'desc']).default('asc'),
});

export const searchSchema = z.object({
    query: z.string().optional(),
    filters: z.record(z.string(), z.unknown()).optional(),
});

export type PaginationParams = z.infer<typeof paginationSchema>;
export type SortParams = z.infer<typeof sortSchema>;
export type SearchParams = z.infer<typeof searchSchema>;