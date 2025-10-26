<script setup lang="ts">
import Table from './Table.vue'

const userStore = useUserStore()
const { users, isLoading } = storeToRefs(userStore)

await userStore.searchUsers({ page: 1, limit: 10})

const columns = [
  {
    accessorKey: 'id',
    header: '#',
    cell: ({ row }: any) => `#${row.getValue('id')}`,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }: any) => row.getValue('email')
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }: any) => row.getValue('name')
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }: any) => {
      const v = row.getValue('createdAt')
      try {
        return v ? new Date(v).toLocaleString() : ''
      } catch {
        return v || ''
      }
    }
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }: any) => {
      const items = [
        { label: 'View' },
        { label: 'Edit' },
        { label: 'Delete', color: 'error' }
      ]

      return h('div', { class: 'text-right' }, h('UDropdownMenu', {
        content: { align: 'end' },
        items,
        'aria-label': 'Row actions'
      }, () => h('UButton', {
        icon: 'i-lucide-ellipsis-vertical',
        color: 'neutral',
        variant: 'ghost',
        class: 'ml-auto',
        'aria-label': 'Actions'
      })))
    }
  }
]
</script>

<template>
  <div class="w-full">
    <Table :data="users" :columns="columns" :pageSize="1" />
  </div>
</template>
