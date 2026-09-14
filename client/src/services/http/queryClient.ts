import { QueryClient } from "@tanstack/vue-query";

// TODO @andrei: consider using the TanStackQuery default options here
// - they are generally chosen for a good reason
// - deviating from them creates more problems than it solves
// - if anything, the options should only be overridden for specific queries, not globally
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 30_000,
            gcTime: 5 * 60_000,
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});
