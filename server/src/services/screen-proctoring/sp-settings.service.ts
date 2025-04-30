import * as ENV from "../../config/envConfig";
import * as utils from "../../utils/utils";

export function getSettings(): Settings{
    return {isSebServerIntegratedMode: utils.stringToBoolean(ENV.SEB_SERVER_INTEGRATED_MODE)};
}