import { Threshold } from "@/models/seb-server/examTemplate";

export type Indicator = {
    id: number;
    examId: number;
    name: string;
    type: string;
    color?: string;
    icon?: string;
    tags?: string;
    thresholds?: Threshold[];
};

export type Indicators = {
    number_of_pages: number;
    page_number: number;
    page_size: number;
    content: Indicator[];
};
