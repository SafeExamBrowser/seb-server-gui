<template>
  <v-row class="navigation-overview-container">
    <v-container class="ml-16 mr-0">
    <v-col>
      <v-sheet elevation="0" color="primary" class="rounded-lg pa-4">

        <v-app-bar-title class="mb-16">
          <h1 class="title-inherit-styling text-h4">{{ appBarStore.title }}</h1>
        </v-app-bar-title>

        <v-row class="mt-4 mb-16 mr-0">
          <v-col cols="4">
            <h4 class="text-subtitle-1 font-weight-bold mb-3">{{ translate("titles.preparation").toUpperCase() }}</h4>

            <v-divider class="section-divider" />

            <v-list-item class="px-0 nav-hover">
              <router-link class="link-color nav-link" :to="constants.EXAM_ROUTE">{{ translate("titles.quizImport") }}</router-link>
            </v-list-item>

            <v-divider class="section-divider" />

            <v-list-item class="px-0 nav-hover">
              <router-link class="link-color nav-link" :to="constants.EXAM_ROUTE">Second Link</router-link>
            </v-list-item>

            <v-divider class="section-divider" />

            <v-list-item class="px-0 nav-hover">
              <router-link class="link-color nav-link" :to="constants.EXAM_ROUTE">Third Link</router-link>
            </v-list-item>

            <v-divider class="section-divider" />

            <v-list-item class="px-0 nav-hover">
              <router-link class="link-color nav-link" :to="constants.EXAM_ROUTE">Fourth Link</router-link>
            </v-list-item>

            <v-divider class="section-divider" />
          </v-col>


          <v-col cols="4">
            <h4 class="text-subtitle-1 font-weight-bold mb-3">{{ translate("titles.monitoring").toUpperCase() }}</h4>

            <v-divider class="section-divider" />

            <v-list-item class="px-0 nav-hover">
              <router-link class="link-color nav-link" :to="constants.MONITORING_ROUTE">{{ translate("navigation.routeNames.runningExams") }}</router-link>
            </v-list-item>

            <v-divider class="section-divider" />

            <v-list-item class="px-0 nav-hover">
              <span class="link-color nav-link">{{ translate("navigation.routeNames.finishedExams") }}</span>
            </v-list-item>

            <v-divider class="section-divider" />

            <v-list-item class="px-0 nav-hover">
              <span class="link-color nav-link">{{ translate("navigation.routeNames.SEBClientLogs") }}</span>
            </v-list-item>

            <v-divider class="section-divider" />
          </v-col>



          <v-col cols="4" v-if="generalUtils.stringToBoolean(authStore.getStorageItem(StorageItemEnum.IS_SP_AVAILABLE))">
            <h4 class="text-subtitle-1 font-weight-bold mb-3">{{ translate("titles.screenProctoring").toUpperCase() }}</h4>

            <v-divider class="section-divider" />

            <v-list-item class="px-0 nav-hover">
              <router-link class="link-color nav-link" :to="spConstants.RUNNING_EXAMS_ROUTE">
                {{ translate("titles.screenProctoring") }}
              </router-link>
            </v-list-item>

            <v-divider class="section-divider" />

            <v-list-item class="px-0 nav-hover">
              <router-link class="link-color nav-link" :to="spConstants.SEARCH_ROUTE">
                {{ translate("titles.spSearch") }}
              </router-link>
            </v-list-item>

            <v-divider class="section-divider" />

            <v-list-item class="px-0 nav-hover">
              <router-link class="link-color nav-link" :to="spConstants.APPLICATIONS_ROUTE">
                {{ translate("titles.spApplications") }}
              </router-link>
            </v-list-item>

            <v-divider class="section-divider mb-16" />
          </v-col>

        </v-row>
        <h3 class="text-subtitle-1 font-weight-bold ml-0 mb-3 mt-16">{{ translate("titles.recentExams").toUpperCase() }}</h3>

        <v-col cols="13">
          <v-sheet elevation="0" color="transparent">
            <v-container fluid class="pa-0">
              <v-row
                v-for="(exam, index) in lastEditedExams"
                :key="index"
                class="align-center border-top py-3">

                <v-col cols="3" class="mr-10">
                  <div class="text-body-1 font-weight-medium">{{ exam.title }}</div>
                </v-col>

                <v-col cols="2">
                  <div class="text-caption">
                    <div class="date-cell">{{ formatDate(exam.start) }}</div>
                    <div class="date-cell">{{ formatTime(exam.start) }}</div>
                  </div>
                </v-col>

                <v-col cols="2">
                  <div class="text-caption">
                    <div class="date-cell">{{ formatDate(exam.end) }}</div>
                    <div class="date-cell">{{ formatTime(exam.end) }}</div>
                  </div>
                </v-col>

                <v-col cols="4" class="d-flex align-center justify-space-between">
                  <div class="d-flex flex-wrap ga-2 align-center">
                    <v-chip label small class="exam-chip">Exam State</v-chip>
                    <v-chip label small class="exam-chip">{{ translate("BYOD").toUpperCase() }}</v-chip>
                  </div>
                  <v-btn variant="outlined" density="comfortable" size="small" class="test-run-btn">
                    Apply Test Run
                  </v-btn>
                </v-col>

                <v-col cols="0.2" class="d-flex align-center justify-end">
                  <v-icon size="28">mdi-chevron-right</v-icon>
                </v-col>

              </v-row>
            </v-container>
          </v-sheet>
        </v-col>
      </v-sheet>
    </v-col>
    </v-container>
  </v-row>
</template>

<script setup lang="ts">
  import { useAppBarStore, useNavigationStore } from "@/stores/store";
  import * as constants from "@/utils/constants";
  import * as spConstants from "@/utils/sp-constants";
  import { translate } from "@/utils/generalUtils";
  import * as generalUtils from "@/utils/generalUtils";
  import { useAuthStore } from "@/stores/authentication/authenticationStore";
  import { StorageItemEnum } from "@/models/StorageItemEnum";
  const appBarStore = useAppBarStore();
  const navigationStore = useNavigationStore();
  const authStore = useAuthStore();

  onBeforeMount(() => {
    appBarStore.title = translate("titles.navigationOverview");
  });

  onMounted(() => {
    navigationStore.isNavigationOverviewOpen = true;
  });

  onUnmounted(() => {
    navigationStore.isNavigationOverviewOpen = false;
  });


  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-GB");
  }

  function formatTime(dateStr: string) {
    return new Date(dateStr).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }


  //mock data for recently edited exams
  const lastEditedExams = [
    {
      title: "725-1300-01S Food Toxicology FS 2024 Final Exam - Repetition",
      start: "2024/11/02 08:00",
      end: "2024/11/03 12:00",
    },
    {
      title: "725-1300-01S Consectetuer dolor sit amet FS 2024 Exam",
      start: "2024/11/02 08:00",
      end: "2024/11/03 12:00",
    },
    {
      title: "725-1300-01S Consectetuer dolor sit amet FS 2024 Exam",
      start: "2024/11/02 08:00",
      end: "2024/11/03 12:00",
    },
  ];

</script>

<style scoped>
  .navigation-overview-container {
    color: white;
    padding: 16px;
  }

  .link-color {
    color: white;
    text-decoration: none;
  }

  .border-top {
    border-top: 1px solid rgba(255, 255, 255, 0.3);
  }

  .nav-hover {
    transition: background 0.4s ease;
    border-radius: 4px;
    background: transparent;
    padding-left: 8px;
    width: 85% !important;
  }

  .nav-hover:hover {
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 1) 0%,
      rgba(255, 255, 255, 0.98) 10%,
      rgba(255, 255, 255, 0.96) 20%,
      rgba(255, 255, 255, 0.93) 25%,
      rgba(255, 255, 255, 0.90) 30%,
      rgba(255, 255, 255, 0.86) 40%,
      rgba(255, 255, 255, 0.80) 60%,
      rgba(255, 255, 255, 0.70) 68%,
      rgba(255, 255, 255, 0.60) 75%,
      rgba(255, 255, 255, 0.45) 82%,
      rgba(33, 92, 175, 0.20) 88%,
      rgba(33, 92, 175, 0.12) 92%,
      rgba(33, 92, 175, 0.08) 96%,
      rgba(33, 92, 175, 0.04) 98%,
      rgba(33, 92, 175, 0.01) 99%,
      rgba(33, 92, 175, 0) 100%
    );
  }

  .nav-link {
    transition: color 0.4s ease;
    margin-left: 10px;
  }

  .nav-hover:hover .nav-link {
    color: #215caf;
  }

  .section-divider {
    background-color: white !important;
    height: 1px !important;
    opacity: 1 !important;
    width: 85% !important;
  }

  .date-cell {
    font-size: 16px;
    line-height: 1.5;
  }

  .exam-chip {
    background-color: #215caf !important;
    color: white !important;
    border: 1px solid white !important;
    border-radius: 2px !important;
  }

  .test-run-btn {
    height: 40px !important;
    padding: 0 16px !important;
  }
</style>
