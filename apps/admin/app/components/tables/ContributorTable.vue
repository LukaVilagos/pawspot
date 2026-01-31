<template>
    <RelationTable :title="title" :data="data" :total="total" :page="page" :columns="columns"
        :empty-message="emptyMessage" search-label="Search Users" search-placeholder="Search by name or email..."
        search-hint="Searching by email address" display-key="name" secondary-display-key="email" :show-filter="true"
        :page-size="10" entity-name="Contributor" :load-data="loadContributors" :search-fn="searchUsers"
        :add-fn="addContributor" :remove-fn="removeContributor" remove-item-name="Contributor" :loading="loading"
        actions-u-r-l-base="/user" table-id="contributors" :sync-url-state="true" @added="onContributorAdded"
        @removed="onContributorRemoved" />
</template>

<script setup lang="ts">
import type { UserSummary, UserResponse, QueryOptions } from '@pawspot/api-contracts'
import type { TypedTableColumn } from '~/types/table-types'

interface Props {
    sanctuaryId: string
    title?: string
    emptyMessage?: string
}

const props = withDefaults(defineProps<Props>(), {
    title: 'Contributors',
    emptyMessage: 'No contributors for this sanctuary.',
})

const emit = defineEmits<{
    (e: 'updated'): void
}>()

const sanctuaryStore = useSanctuaryStore()
const userStore = useUserStore()

const data = ref<UserSummary[]>([])
const total = ref(0)
const page = ref(1)
const loading = ref(false)

const columns: TypedTableColumn<UserSummary>[] = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'email', header: 'Email', sortable: true, filter: { type: 'text' } },
    { accessorKey: 'name', header: 'Name', sortable: true, filter: { type: 'text' } },
]

async function loadContributors(query: QueryOptions<UserSummary>): Promise<void> {
    loading.value = true
    try {
        const result = await sanctuaryStore.searchContributors(props.sanctuaryId, query)
        data.value = result.items
        total.value = result.total
        page.value = query.page || 1
    } finally {
        loading.value = false
    }
}

async function searchUsers(query: string): Promise<UserSummary[]> {
    const searchQuery: QueryOptions<UserResponse> = {
        page: 1,
        limit: 10,
    }
    if (query.trim()) {
        searchQuery.filter = [['email', { op: 'contains', value: query }]]
    }
    const result = await userStore.searchUsers(searchQuery)
    return (
        result?.items?.map((user) => ({
            id: user.id,
            email: user.email,
            name: user.name,
        })) ?? []
    )
}

async function addContributor(userId: string): Promise<void> {
    await sanctuaryStore.addContributor(props.sanctuaryId, userId)
}

async function removeContributor(userId: string): Promise<void> {
    await sanctuaryStore.removeContributor(props.sanctuaryId, userId)
}

function onContributorAdded() {
    loadContributors({ page: 1, limit: 10 })
    emit('updated')
}

function onContributorRemoved() {
    loadContributors({ page: page.value, limit: 10 })
    emit('updated')
}

onMounted(() => {
    loadContributors({ page: 1, limit: 10 })
})
</script>
