<template>
    <Create :fields="items" :schema="CreatePostSchema" redirect-to="/post" entity-name="Post"
        :initial-values="initialValues" @cancel="onCancel" @created="onCreated" />
</template>

<script setup lang="ts">
import type { CreatePostRequest } from '@pawspot/api-contracts'
import type { PageItem } from '~/types/PageItem'
import { CreatePostSchema } from '~/utils/validation/postSchemas';
import { userToOptions, sanctuaryToOptions } from '~/utils/options'

const postStore = usePostStore()
const sanctuaryStore = useSanctuaryStore()
const userStore = useUserStore()

await Promise.all([
    userStore.fetchUsers(),
    sanctuaryStore.fetchSanctuaries()
])

const { users } = storeToRefs(userStore)
const { sanctuaries } = storeToRefs(sanctuaryStore)

const { prefilledId: prefilledSanctuaryId, navigateAfterCreate, navigateOnCancel } = useCrudPage({
    basePath: '/post',
    prefilledIdKey: 'sanctuaryId',
    prefilledParentPath: '/sanctuary'
})

const initialValues = computed(() => {
    const values: Partial<CreatePostRequest> = {}
    if (prefilledSanctuaryId.value) {
        values.sanctuaryId = prefilledSanctuaryId.value
    }
    return values
})

const userOptions = computed(() => userToOptions(users.value))
const sanctuaryOptions = computed(() => sanctuaryToOptions(sanctuaries.value))

const onCreated = async (values: CreatePostRequest, passedReturnUrl?: string) => {
    const createdItem = await postStore.createPost(values)
    navigateAfterCreate(createdItem.id, passedReturnUrl)
}

const onCancel = (passedReturnUrl?: string) => {
    navigateOnCancel(passedReturnUrl)
}

const items = computed<PageItem<CreatePostRequest>[]>(() => [
    { accessorKey: 'title', header: 'Title', type: 'text' },
    { accessorKey: 'content', header: 'Content', type: 'text' },
    { accessorKey: 'userId', header: 'Author', type: 'select-search', options: userOptions.value },
    { accessorKey: 'sanctuaryId', header: 'Sanctuary', type: 'select-search', options: sanctuaryOptions.value },
])
</script>
