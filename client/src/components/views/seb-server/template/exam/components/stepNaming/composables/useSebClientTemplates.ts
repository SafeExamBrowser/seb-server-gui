import { useFetch } from "./useFetch";

type SebClientTemplate = {
    id: string;
    name: string;
};

// TODO @alain: fetch real data here, once I figure out, which API to use
export const useSebClientTemplates = () =>
    useFetch<SebClientTemplate[]>(async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        return new Promise((resolve) =>
            resolve([
                { id: "id-1", name: "SEB Client Template 1" },
                { id: "id-2", name: "SEB Client Template 2" },
                { id: "id-3", name: "SEB Client Template 3" },
            ]),
        );
    });
