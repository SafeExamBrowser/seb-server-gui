export type SPExamView = {
    uuid: string;
    name: string;
    startTime: number;
    endTime: number;
};

export type SPExam = {
    creationTime: number;
    description: string;
    id: number;
    lastUpdateTime: number;
    name: string;
    owner: string;
    startTime: number;
    type: string;
    url: string;
    userUUIDs: string[];
    uuid: string;
};
