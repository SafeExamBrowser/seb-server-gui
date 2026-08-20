import { computed } from "vue";

import { GUIAction, useAbilities } from "@/services/ability.ts";

export const useShowInstitutionColumn = () => {
    const ability = useAbilities();

    return computed(() => ability.canDo(GUIAction.SHOW_INSTITUTION_COLUMN));
};
