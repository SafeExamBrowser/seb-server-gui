type Indicators = {
    number_of_pages: number;
    page_number: number;
    page_size: number;
    content: Indicator[];
}

type Indicator = {
    id: number;
    examId: number;
    name: string;
    type: string;
    color?: string;
    icon?: string;
    tags?: string;
    thresholds?: Threshold[];
};