<template>
    <Create :fields="items" :schema="CreatePostSchema" redirect-to="/post" entity-name="Post"
        :initial-values="initialValues" @cancel="onCancel" @created="onCreated" />
</template>

<script setup lang="ts">
import type { CreatePostRequest } from '@pawspot/api-contracts'
import type { PageItem } from '~/types/PageItem'
import { CreatePostSchema } from '~/utils/validation/postSchemas';

const postStore = usePostStore()
const sanctuaryStore = useSanctuaryStore()
const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

await Promise.all([
    userStore.fetchUsers(),
    sanctuaryStore.fetchSanctuaries()
])

const { users } = storeToRefs(userStore)
const { sanctuaries } = storeToRefs(sanctuaryStore)

const prefilledSanctuaryId = computed(() => {
    const sanctuaryId = route.query.sanctuaryId
    return typeof sanctuaryId === 'string' ? sanctuaryId : undefined
})

const initialValues = computed(() => {
    const values: Partial<CreatePostRequest> = {}
    if (prefilledSanctuaryId.value) {
        values.sanctuaryId = prefilledSanctuaryId.value
    }
    return values
})

const returnUrl = computed(() => {
    const url = route.query.returnUrl
    return typeof url === 'string' ? url : undefined
})

const userOptions = computed(() =>
    users.value.map(u => ({ label: u.name || u.email, value: u.id }))
)

const sanctuaryOptions = computed(() =>
    sanctuaries.value.map(s => ({ label: s.name, value: s.id }))
)

const onCreated = async (values: CreatePostRequest, passedReturnUrl?: string) => {
    const createdItem = await postStore.createPost(values)
    const redirectTarget = passedReturnUrl || returnUrl.value
    if (redirectTarget) {
        router.push(redirectTarget)
    } else {
        router.push(`/post/${createdItem.id}`)
    }
}

const onCancel = (passedReturnUrl?: string) => {
    const redirectTarget = passedReturnUrl || returnUrl.value
    if (redirectTarget) {
        router.push(redirectTarget)
    } else if (prefilledSanctuaryId.value) {
        router.push(`/sanctuary/${prefilledSanctuaryId.value}`)
    } else {
        router.push('/post')
    }
}

const items = computed<PageItem<CreatePostRequest>[]>(() => [
    { accessorKey: 'title', header: 'Title', type: 'text' },
    { accessorKey: 'content', header: 'Content', type: 'text' },
    { accessorKey: 'userId', header: 'Author', type: 'select-search', options: userOptions.value },
    { accessorKey: 'sanctuaryId', header: 'Sanctuary', type: 'select-search', options: sanctuaryOptions.value },
])
</script>
