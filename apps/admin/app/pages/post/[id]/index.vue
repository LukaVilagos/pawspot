<template>
    <View v-if="post" :item="displayItem" :fields="fields" entity-name="Post" :on-edit="onEdit" :on-delete="onDelete" />
    <LoadingSpinner v-else />
</template>

<script setup lang="ts">
import type { PageItem } from '~/types/PageItem'

const postStore = usePostStore()
const { post } = storeToRefs(postStore)

const { entityId, navigateToEdit, navigateAfterDelete } = useCrudPage({
    basePath: '/post'
})

await postStore.fetchPostById(entityId.value)

const onEdit = () => navigateToEdit()
const onDelete = async () => {
    await postStore.deletePost(entityId.value)
    navigateAfterDelete()
}

const displayItem = computed(() => ({
    title: post.value?.title,
    content: post.value?.content,
    author: post.value?.user?.name || post.value?.user?.email || '-',
    sanctuary: post.value?.sanctuary?.name || '-',
    createdAt: post.value?.createdAt,
}))

const fields = computed<PageItem<typeof displayItem.value>[]>(() => [
    { accessorKey: 'title', header: 'Title', type: 'text' },
    { accessorKey: 'content', header: 'Content', type: 'text' },
    {
        accessorKey: 'author',
        header: 'Author',
        type: 'text',
        href: post.value?.user ? `/user/${post.value.user.id}` : undefined
    },
    {
        accessorKey: 'sanctuary',
        header: 'Sanctuary',
        type: 'text',
        href: post.value?.sanctuary ? `/sanctuary/${post.value.sanctuary.id}` : undefined
    },
    { accessorKey: 'createdAt', header: 'Created At', type: 'text' },
])
</script>
