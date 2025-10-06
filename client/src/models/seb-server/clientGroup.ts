type ClientGroup = {
    id?: number;
    examId?: number;
    name: string;
    type: string;
    color?: string;
    icon?: string;
    ipRangeStart?: string;
    ipRangeEnd?: string;
    clientOS?: string;
    nameRangeStartLetter?: string;
    nameRangeEndLetter?: string;
    isSPSGroup?: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ClientGroups = {
    number_of_pages: number;
    page_number: number;
    page_size: number;
    content: ClientGroup[];
};
