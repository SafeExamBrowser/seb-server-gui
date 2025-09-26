import * as examViewService from "@/services/seb-server/component-services/examViewService";
import { useFetch } from "./useFetch";

// TODO @alain: get only active connection configurations and filter by configPurpose "START_EXAM"
export const useConnectionConfigurations = () =>
    useFetch<ConnectionConfigurations>(() =>
        examViewService.getConnectionConfigurations(),
    );
