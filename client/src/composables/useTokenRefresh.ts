import { useAuthStore } from "@/composables/store/useAuthStore";
import { watch } from "vue";

const REFRESH_SAFETY_MARGIN_MILLISECONDS = 10 * 60 * 1000; // 10 minutes in milliseconds

export const useTokenRefresh = () => {
    const handleChange = (newRefreshBefore?: string) => {
        console.log("refreshBefore changed!", newRefreshBefore);

        if (!newRefreshBefore) {
            console.log("user not logged in, do nothing!");
            // TODO @alain: cleanup the timer here
            return;
        }

        const millisecondsUntilRefresh =
            new Date(newRefreshBefore).getTime() - new Date().getTime();

        if (millisecondsUntilRefresh <= REFRESH_SAFETY_MARGIN_MILLISECONDS) {
            // TODO @alain: call the refresh token endpoint here
            console.log("- - - -refresh now!");
            console.log("millisecondsUntilRefresh", millisecondsUntilRefresh);
            return;
        }

        // TODO @alain: start a timer here
        console.log(
            `token still valid for ${millisecondsUntilRefresh} milliseconds. Just start a timer.`,
        );
    };

    watch(() => useAuthStore().refreshBefore, handleChange, {
        immediate: true, // this let's us react to the initial value too
    });
};
