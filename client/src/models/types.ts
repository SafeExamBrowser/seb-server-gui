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