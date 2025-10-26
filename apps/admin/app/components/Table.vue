<script setup lang="ts">
const props = withDefaults(defineProps<{
  data?: unknown[]
  columns?: any[]
  pageSize?: number
  showFilter?: boolean
  sticky?: boolean 
}>(), {
  data: () => [],
  columns: () => [],
  pageSize: 10,
  showFilter: true,
  sticky: false,
})

const globalFilter = ref('')
const pagination = ref({ pageIndex: 0, pageSize: props.pageSize })

const table = ref<any>(null)

function updatePage(p: number) {
  table.value?.tableApi?.setPageIndex(p - 1)
}
</script>

<template>
  <div class="flex flex-col w-full">
    <div v-if="showFilter" class="flex gap-2 items-center px-4 py-3.5 border-b border-accented">
      <UInput
        v-model="globalFilter"
        class="max-w-sm"
        placeholder="Filter..."
      />
    </div>

    <UTable
      ref="table"
      :data="data"
      :columns="columns"
      :sticky="sticky"
      v-model:global-filter="globalFilter"
      v-model:pagination="pagination"
      class="flex-1 w-full"
    >
      <slot />
    </UTable>

    <div class="flex justify-center border-t border-default pt-4">
      <UPagination
        :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
        :items-per-page="table?.tableApi?.getState().pagination.pageSize"
        :total="table?.tableApi?.getFilteredRowModel().rows.length || (data?.length || 0)"
        @update:page="updatePage"
      />
    </div>
  </div>
</template>