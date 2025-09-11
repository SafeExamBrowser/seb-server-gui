type Quiz = {
    quiz_id: string;
    institutionId: number;
    lms_setup_id: number;
    lms_setup_type: string;
    quiz_name: string;
    quiz_description: string;
    quiz_start_time: string;
    quiz_end_time: string;
    quiz_start_url: string;
    additionalAttributes: object;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Quizzes = {
    number_of_pages: number;
    page_number: number;
    page_size: number;
    content: Quiz[];
    complete: boolean;
};
