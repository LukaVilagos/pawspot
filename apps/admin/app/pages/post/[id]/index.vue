<template>
    <View v-if="post" :item="displayItem" :fields="fields" entity-name="Post" :on-edit="onEdit" :on-delete="onDelete" />
    <div v-else class="flex items-center justify-center h-screen">
        <UIcon name="i-heroicons-arrow-path" class="animate-spin" />
    </div>
</template>

<script setup lang="ts">
import type { PageItem } from '~/types/PageItem'

const route = useRoute()
const router = useRouter()
const postStore = usePostStore()
const { post } = storeToRefs(postStore)

await postStore.fetchPostById(String(route.params.id))

const returnUrl = computed(() => {
    const url = route.query.returnUrl
    return typeof url === 'string' ? url : undefined
})

const onEdit = () => {
    const editPath = `/post/${route.params.id}/edit/`
    if (returnUrl.value) {
        router.push(`${editPath}?returnUrl=${encodeURIComponent(returnUrl.value)}`)
    } else {
        router.push(editPath)
    }
}
const onDelete = async () => {
    await postStore.deletePost(String(route.params.id))
    if (returnUrl.value) {
        router.push(returnUrl.value)
    } else {
        router.push('/post')
    }
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
