import { defineStore } from "pinia";
import { ref, computed } from "vue";
import {
    SEBSettingsValue,
    SEBSettingsView,
    SEBSettingAttribute,
} from "@/models/seb-server/sebSettings";
import { ViewType } from "@/models/seb-server/sebSettingsEnums";
import * as sebSettingsService from "@/services/seb-server/sebSettingsService";
import { stringToBoolean } from "@/utils/generalUtils";

const getInitialState = () => ({
    isReady: false,
    isExam: true,
    selectedContainerId: null,
    readonly: true,
    activeSEBClientConnection: null,
    dialogTitle: null,
    ignoreSEBService: false,
});

export const useSEBSettingsStore = defineStore("sebSettings", () => {
    // store is ready when selectedContainerId is set
    const isReady = computed<boolean>(
        () => selectedContainerId.value != undefined,
    );

    // indicates we currently work with Exam SEB Settings. If false we work with Configuration Template SEB Settings
    const isExam = ref<boolean>(getInitialState().isExam);
    // The SEB Settings container Id, either Exam id or Configuration Template id
    const selectedContainerId = ref<number | null>(
        getInitialState().selectedContainerId,
    );
    // readonly flag for SEB Settings. Depends on Exam State or User rights or something else
    const readonly = ref<boolean>(getInitialState().readonly);
    // indicates if there are active SEB client connections. This is only needed within Exam context
    const activeSEBClientConnection = ref<number | null>(
        getInitialState().activeSEBClientConnection,
    );

    const dialogTitle = ref<string | null>(getInitialState().dialogTitle);
    const ignoreSEBService = ref<boolean>(getInitialState().ignoreSEBService);

    const singleValues: Map<string, SEBSettingsValue> = new Map<
        string,
        SEBSettingsValue
    >();

    const attributes: Map<string, SEBSettingAttribute> = new Map<
        string,
        SEBSettingAttribute
    >();

    // Single Value Settings
    async function fetchSingleValues(view: ViewType) {
        if (selectedContainerId.value == null) return;

        console.info("**** fetch: " + view);

        const fetchedValues: SEBSettingsView | null =
            await sebSettingsService.getView(
                view,
                selectedContainerId.value.toString(),
                isExam.value,
            );
        if (fetchedValues == null) {
            return;
        }

        const newMap = new Map<string, SEBSettingsValue>(
            Object.entries(fetchedValues.singleValues),
        );
        const newAttrMap = new Map<string, SEBSettingAttribute>(
            Object.entries(fetchedValues.attributes),
        );

        newMap.forEach((v, k) => {
            singleValues.set(k, v);
        });
        newAttrMap.forEach((v, k) => {
            attributes.set(k, v);
        });
    }

    function getSingleValue(name: string): SEBSettingsValue {
        const value = singleValues.get(name);
        if (!value) {
            throw new Error("No Single Value" + name + " found");
        }

        return value;
    }

    function getStringValue(name: string): string {
        return getSingleValue(name).value;
    }

    function getBooleanValue(name: string): boolean {
        return stringToBoolean(getStringValue(name));
    }

    function getNumberValue(name: string): number {
        return Number(getStringValue(name));
    }

    async function saveSingleValue(name: string, value: string) {
        if (selectedContainerId.value == null) return;

        const setting: SEBSettingsValue = getSingleValue(name);
        try {
            await sebSettingsService.updateSEBSettingValue(
                selectedContainerId.value.toString(),
                setting.id.toString(),
                value,
                isExam.value,
            );
        } catch (err) {
            // @anhefti TODO propagate error message
            console.error(err);
        }
    }

    function applyAttributes(
        name: string,
        items: { title: string; value: string }[],
    ) {
        attributes
            .get(name)
            ?.resources?.split(",")
            .forEach((item) => {
                items.push({
                    title: item,
                    value: item,
                });
            });
    }

    const $reset = () => {
        isExam.value = getInitialState().isExam;
        selectedContainerId.value = getInitialState().selectedContainerId;
        readonly.value = getInitialState().readonly;
        activeSEBClientConnection.value =
            getInitialState().activeSEBClientConnection;
        dialogTitle.value = getInitialState().dialogTitle;
        ignoreSEBService.value = getInitialState().ignoreSEBService;
    };

    return {
        isReady,
        isExam,
        selectedContainerId,
        readonly,
        ignoreSEBService,
        activeSEBClientConnection,
        dialogTitle,
        singleValues,
        attributes,
        fetchSingleValues,
        getSingleValue,
        getStringValue,
        getBooleanValue,
        getNumberValue,
        saveSingleValue,
        applyAttributes,
        $reset,
    };
});
