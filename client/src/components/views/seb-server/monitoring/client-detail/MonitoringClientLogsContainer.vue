<template>
    <!-- Search and filter controls -->
    <v-sheet elevation="4"
             class="rounded-lg pa-8">

        <v-row >
            <v-col cols="3">
                <v-tabs v-model="statusFilter"
                        fixed-tabs
                        color="primary"
                        class="mb-4">
                    <v-tab value="all">All ({{ totalLogs }})</v-tab>
                    <v-tab value="info">Info ({{ infoCount }})</v-tab>
                    <v-tab value="warn">Warning ({{ warnCount }})</v-tab>
                    <v-tab value="error">Error ({{ errorCount }})</v-tab>
                </v-tabs>
            </v-col>

            <v-col cols="2">
            </v-col>

            <v-col cols="7">
                <v-row class="mb-4" align="center">
                    <v-col cols="12" md="8">
                        <v-text-field
                            v-model="searchQuery"
                            label="Search"
                            prepend-inner-icon="mdi-magnify"
                            clearable
                            variant="outlined"
                            dense
                        />
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-select
                            v-model="filterType"
                            :items="filterOptions"
                            label="Filter by Type"
                            variant="outlined"
                            dense
                        />
                    </v-col>
                </v-row>
            </v-col>
        </v-row>


        <!-- Timeline of log entries -->
        <v-slide-x-transition mode="out-in">
            <v-timeline
                v-if="paginatedLogs.length"
                direction="horizontal"
                align="start"
                density="comfortable"
                dot-color="white"
                fill-dot
                style="overflow-x: auto; white-space: nowrap;"
                class="py-2"
            >
                <v-timeline-item
                    v-for="item in paginatedLogs"
                    :key="item.key"
                    :hide-dot="item.isGroup"
                    class="pb-0"
                >
                    <template #icon v-if="!item.isGroup">
                        <v-icon :icon="severityMap[item.severity!].icon" :color="severityMap[item.severity!].color" />
                    </template>

                    <template v-if="!item.isGroup">
                        <v-card elevation="2" rounded="lg" class="px-4 py-2">
                            <div class="font-weight-medium">{{ item.message }}</div>
                            <div class="grey--text text--lighten-1 text-truncate">
                                <span v-if="item.user">{{ item.user }} - </span>{{ timeLabel(item.timestamp) }}
                            </div>
                        </v-card>
                    </template>
                </v-timeline-item>
            </v-timeline>
        </v-slide-x-transition>

            <!-- Pagination controls -->
        <v-pagination
            v-model="currentPage"
            :length="pageCount"
            total-visible="7"
            class="mt-4"
        />

    </v-sheet>
</template>


<script setup lang='ts'>
import {ref, reactive, computed, watch} from 'vue'

// Mock log data
interface LogEntry {
    id: number
    severity: 'info' | 'warn' | 'error'
    message: string
    timestamp: Date
    resolved: boolean
    resolvedAt: Date | null
    user?: string
    session?: string
    value?: string | number
    expanded: boolean
}

const logs = reactive<LogEntry[]>([
    {
        id: 1,
        severity: 'error',
        message: 'Upload failed for Task ID #129883',
        timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
        resolved: false,
        resolvedAt: null,
        user: 'Nicholas Sharp',
        session: 'SESSION12345',
        value: null,
        expanded: false
    },
    {
        id: 2,
        severity: 'warn',
        message: 'High memory usage detected',
        timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
        resolved: false,
        resolvedAt: null,
        user: 'Server Monitor',
        session: 'SYSTEM',
        value: '85%',
        expanded: false
    },
    {
        id: 3,
        severity: 'info',
        message: 'New user registration',
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        resolved: true,
        resolvedAt: new Date(Date.now() - 1 * 60 * 1000), // resolved 1 minute ago
        user: 'Alice Doe',
        session: 'WEB-8899',
        value: null,
        expanded: false
    },
    {
        id: 4,
        severity: 'error',
        message: 'Database connection timeout',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        resolved: true,
        resolvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // resolved 2 days ago, 2 hours later
        user: 'Backend Service',
        session: 'SERVICE-42',
        value: 'Timeout after 30s',
        expanded: false
    },
    {
        id: 5,
        severity: 'warn',
        message: 'User attempt limit nearly reached',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        resolved: false,
        resolvedAt: null,
        user: 'Auth Module',
        session: 'AUTH-775',
        value: '4/5 attempts',
        expanded: false
    }
])

// Search, filter, and pagination state
const searchQuery = ref<string>('')
const filterType = ref<string>('All')
const filterOptions = ['All', 'Info', 'Warn', 'Error']
const statusFilter = ref<string>('all')  // 'all', 'resolved', 'unresolved'
const currentPage = ref(1)
const itemsPerPage = 4  // number of logs per page

// Mappings for severity icons and colors
const severityMap: Record<string, { icon: string, color: string }> = {
    info: { icon: 'mdi-information', color: 'blue' },
    warn: { icon: 'mdi-alert', color: 'orange' },
    error: { icon: 'mdi-alert-circle', color: 'red' }
}


// Computed filtered logs based on search and filters
const filteredLogs = computed((): LogEntry[] => {
    return logs.filter(log => {
        // Filter by severity type
        const matchesType = (filterType.value === 'All') || (log.severity.toLowerCase() === filterType.value.toLowerCase())
        // Filter by resolved status
        const matchesStatus = (statusFilter.value === 'all') || (log.severity === statusFilter.value)

        // Filter by search query (in message, user, or session)
        const query = searchQuery.value.trim().toLowerCase()
        const matchesSearch = !query ||
            (log.message.toLowerCase().includes(query) ||
                (log.user && log.user.toLowerCase().includes(query)) ||
                (log.session && log.session.toLowerCase().includes(query)))
        return matchesType && matchesStatus && matchesSearch
    })
})

// Group logs by date for timeline display
interface TimelineItem {
    key: string | number
    isGroup: boolean
    label?: string
    // For log items, include all LogEntry fields
    id?: number
    severity?: string
    message?: string
    timestamp?: Date
    resolved?: boolean
    resolvedAt?: Date | null
    user?: string
    session?: string
    value?: string | number
    expanded?: boolean
}

const groupedLogs = computed((): TimelineItem[] => {
    const result: TimelineItem[] = []
    let lastDateLabel: string | null = null
    // Sort logs by timestamp descending (latest first)
    const sorted = [...filteredLogs.value].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    for (const log of sorted) {
        const dateLabel = getDateLabel(log.timestamp)
        if (dateLabel !== lastDateLabel) {
            // Push a group label item
            result.push({
                key: 'date-' + dateLabel,
                isGroup: true,
                label: dateLabel
            })
            lastDateLabel = dateLabel
        }
        // Push the log item
        result.push({
            key: 'log-' + log.id,
            isGroup: false,
            ...log
        })
    }
    return result
})

// Pagination computed
const pageCount = computed((): number => {
    const totalItems = groupedLogs.value.length
    return Math.max(1, Math.ceil(totalItems / itemsPerPage))
})
const paginatedLogs = computed((): TimelineItem[] => {
    const start = (currentPage.value - 1) * itemsPerPage
    return groupedLogs.value.slice(start, start + itemsPerPage)
})

// Count for tabs (total logs, unresolved, resolved)
const totalLogs = computed(() => logs.length)
const infoCount = computed(() => logs.filter(log => log.severity === 'info').length)
const warnCount = computed(() => logs.filter(log => log.severity === 'warn').length)
const errorCount = computed(() => logs.filter(log => log.severity === 'error').length)


// Watch to reset page if filtered results shrink
watch(filteredLogs, () => {
    if (currentPage.value > pageCount.value) {
        currentPage.value = pageCount.value || 1
    }
})

// Methods
function toggleExpand(item: TimelineItem) {
    if (!item.isGroup && typeof item.expanded === 'boolean') {
        item.expanded = !item.expanded
    }
}

function timeLabel(date: Date): string {
    const now = Date.now()
    const diffSec = (now - date.getTime()) / 1000
    if (diffSec < 60) {
        const secs = Math.floor(diffSec)
        return secs <= 1 ? 'just now' : `${secs} seconds ago`
    }
    if (diffSec < 60 * 30) { // less than 30 minutes
        const mins = Math.floor(diffSec / 60)
        return mins === 1 ? '1 minute ago' : `${mins} minutes ago`
    }
    // Otherwise, return absolute time (e.g. "8:20 AM")
    return formatTime(date)
}

function formatTime(date: Date): string {
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const ampm = hours >= 12 ? 'PM' : 'AM'
    const h12 = hours % 12 || 12
    const minStr = minutes < 10 ? '0' + minutes : '' + minutes
    return `${h12}:${minStr} ${ampm}`
}

function formatDateTime(date: Date): string {
    // Format date & time with weekday
    return date.toLocaleString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true
    })
}

function getDateLabel(date: Date): string {
    const today = new Date()
    // Normalize provided date and today to midnight for comparison
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const yesterdayDate = new Date(todayDate.getTime() - 24 * 60 * 60 * 1000)
    if (d.getTime() === todayDate.getTime()) {
        return 'Today'
    }
    if (d.getTime() === yesterdayDate.getTime()) {
        return 'Yesterday'
    }
    // Otherwise, return formatted date (e.g. "Mon, Jul 12, 2025")
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}
</script>



