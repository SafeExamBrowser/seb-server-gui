import { useMutation } from "@/composables/useMutation";
import { ConfigurationExamMapping } from "@/models/seb-server/configurationNode";
import { updateExamConfigMapping } from "@/services/seb-server/examService";

export const useUpdateConfigPasswordEncryption = () => {
    const { data, loading, error, mutateData } = useMutation(
        (configMapping: ConfigurationExamMapping) =>
            updateExamConfigMapping(configMapping),
    );

    return {
        data,
        loading,
        error,
        fetch: mutateData,
    };
};
