<template>
    <Edit v-if="post" :item="postWithIds" :fields="items" :schema="EditPostSchema" :saveFn="savePost"
        redirect-to="/post" entity-name="Post" />
    <div v-else class="flex items-center justify-center h-screen">
        <UIcon name="i-heroicons-arrow-path" class="animate-spin" />
    </div>
</template>

<script setup lang="ts">
import type { PostResponse } from '@pawspot/api-contracts'
import type { PageItem } from '~/types/PageItem'
import { EditPostSchema } from '~/utils/validation/postSchemas'

const route = useRoute()
const postStore = usePostStore()
const sanctuaryStore = useSanctuaryStore()
const userStore = useUserStore()
const { post } = storeToRefs(postStore)

await Promise.all([
    postStore.fetchPostById(String(route.params.id)),
    userStore.fetchUsers(),
    sanctuaryStore.fetchSanctuaries()
])

const { users } = storeToRefs(userStore)
const { sanctuaries } = storeToRefs(sanctuaryStore)

const userOptions = computed(() =>
    users.value.map(u => ({ label: u.name || u.email, value: u.id }))
)

const sanctuaryOptions = computed(() =>
    sanctuaries.value.map(s => ({ label: s.name, value: s.id }))
)

const postWithIds = computed(() => {
    if (!post.value) return null
    return {
        ...post.value,
        userId: post.value.user?.id,
        sanctuaryId: post.value.sanctuary?.id
    }
})

const savePost = async (id: string | number | undefined, payload: Record<string, any>) => {
    if (!id) throw { message: 'Missing id' }
    await postStore.updatePost(String(id), payload)
}

const items = computed<PageItem<PostResponse & { userId?: string; sanctuaryId?: string }>[]>(() => [
    { accessorKey: 'title', header: 'Title', type: 'text' },
    { accessorKey: 'content', header: 'Content', type: 'text' },
    { accessorKey: 'userId', header: 'Author', type: 'select-search', options: userOptions.value },
    { accessorKey: 'sanctuaryId', header: 'Sanctuary', type: 'select-search', options: sanctuaryOptions.value },
])
</script>
