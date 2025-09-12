// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const SERVER_URL = window.VITE_SERVER_URL;
export const SERVER_PORT = getServerPort();

function getServerPort() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (!window.VITE_SERVER_PORT) {
        return "";
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return ":" + window.VITE_SERVER_PORT;
}
