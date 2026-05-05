<template>
    <v-col class="pt-1 pb-1">
        <v-textarea
            v-model="sebAllowedVersions"
            density="compact"
            multi-line
            :rules="[allowedVersionRule]"
            validate-on="eager"
            :label="showLabel ? translate(label) : ''"
            :disabled="disabled"
            variant="outlined"
            @update:focused="saveAllowedVersion($event)"
        >
        </v-textarea>
    </v-col>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { translate } from "@/utils/generalUtils.ts";
import { SEBSettingsSingeValueModel } from "@/components/widgets/sebSettings/types.ts";

const props = defineProps<{
    modelValue: SEBSettingsSingeValueModel;
    name: string;
    label: string;
    showLabel?: boolean;
    tooltip?: boolean;
    disabled?: boolean;
}>();

const sebAllowedVersions = ref<string>(
    toSEBVersion(props.modelValue.getStringValue(props.name)),
);

async function saveAllowedVersion(focusIn: boolean) {
    if (focusIn || !sebVersionsValid) {
        return;
    }
    if (sebAllowedVersions.value == null) {
        props.modelValue.saveSingleValue("sebAllowedVersions", "");
        return;
    }

    const versions = sebAllowedVersions.value.split("\n");
    var valToSave = "";
    for (let v of versions) {
        valToSave += (valToSave.length > 0 ? "," : "") + v;
    }
    props.modelValue.saveSingleValue("sebAllowedVersions", valToSave);
}

var sebVersionsValid = true;
const allowedVersionRule = () => {
    if (sebAllowedVersions.value == null) {
        return true;
    }

    const versions = sebAllowedVersions.value.split("\n");
    for (let v of versions) {
        if (!isSEBVersionValid(v)) {
            sebVersionsValid = false;
            return "Invalid SEB Version: " + v;
        }
    }

    sebVersionsValid = true;
    return true;
};

const OS_WINDOWS_IDENTIFIER = "Win";
const OS_MAC_IDENTIFIER = "Mac";
const OS_IOS_IDENTIFIER = "iOS";
const ALLIANCE_EDITION_IDENTIFIER = "AE";
const MINIMAL_IDENTIFIER = "min";

function isSEBVersionValid(version: string): boolean {
    if (version === "") return true;

    if (version.endsWith(".")) {
        return false;
    }

    const sections = version.split(".");
    if (sections.length < 3) {
        return false;
    }

    // check os
    if (
        !(
            sections[0] === OS_WINDOWS_IDENTIFIER ||
            sections[0] === OS_MAC_IDENTIFIER ||
            sections[0] === OS_IOS_IDENTIFIER
        )
    ) {
        return false;
    }

    // check major version is a number
    if (isNaN(Number(sections[1]))) {
        return false;
    }

    // check minor version is a number
    if (isNaN(Number(sections[2]))) {
        return false;
    }

    // next is either not available patch version or AE or min
    if (sections.length > 3) {
        // check if it is either patch version nor AE nor min
        if (
            isNaN(Number(sections[3])) &&
            sections[3] !== ALLIANCE_EDITION_IDENTIFIER &&
            sections[3] !== MINIMAL_IDENTIFIER
        ) {
            return false;
        }
    }

    // next is either not available or AE or min
    if (sections.length > 4) {
        // check if it is either patch version nor AE nor min
        if (
            sections[4] !== ALLIANCE_EDITION_IDENTIFIER &&
            sections[4] !== MINIMAL_IDENTIFIER
        ) {
            return false;
        }
    }

    // next is either not available or min
    if (sections.length > 4) {
        // check if it is either patch version nor AE nor min
        if (sections[4] !== MINIMAL_IDENTIFIER) {
            return false;
        }
    }

    return true;
}

function toSEBVersion(versions: string): string {
    if (versions == null) {
        return versions;
    }

    return versions.replaceAll(",", "\n");
}
</script>
