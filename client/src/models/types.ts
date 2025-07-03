//todo: extract small types to this file
type ServerTablePaging = {
    page: number,
    itemsPerPage: number,
    sortBy: {key: string, order: string}[]
}

type GridSize = {
    title: string;
    value: number;
};

type NavigationItem = {
    title: string,
    route: string,
    icon: string
}

type DetailedNavigationLinks = {
    [key: string]: NavigationItem[];
};

type Page = {
    number_of_pages: number,
    page_number: number,
    page_size: number
}

