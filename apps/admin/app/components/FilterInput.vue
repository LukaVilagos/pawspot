<template>
  <div class="flex flex-col gap-1 min-w-[180px]">
    <label class="text-xs font-medium">{{ label }}</label>
    <div class="flex items-center gap-1">
      <template v-if="filterConfig.type === 'range'">
        <UInput
          v-model="rangeFrom"
          type="date"
          size="sm"
          placeholder="From"
        />
        <UInput
          v-model="rangeTo"
          type="date"
          size="sm"
          placeholder="To"
        />
      </template>

      <template v-else-if="filterConfig.type === 'select'">
        <USelect
          v-model="value"
          :options="selectOptions"
          size="sm"
          placeholder="Select..."
        />
      </template>

      <template v-else-if="filterConfig.type === 'boolean'">
        <UCheckbox v-model="boolValue" />
      </template>

      <template v-else-if="filterConfig.type === 'number'">
        <UInput
          v-model.number="value"
          type="number"
          size="sm"
          placeholder="Enter number"
        />
      </template>

      <template v-else-if="filterConfig.type === 'date'">
        <UInput
          v-model="value"
          type="date"
          size="sm"
        />
      </template>

      <template v-else>
        <UInput
          v-model="value"
          type="text"
          size="sm"
          placeholder="Enter text"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FilterConfig, FilterOption } from '~/types/table-types'
import type { FilterCondition, FilterOperator } from '@pawspot/api-contracts'

type FilterOutput = FilterCondition | null

interface SelectOption {
  label: string
  value: string | number | boolean
}

const props = defineProps<{
  filterConfig: FilterConfig
  field: string
  label: string
  modelValue?: FilterOutput
}>()

const emit = defineEmits<{
  (e: 'update', value: FilterOutput): void
}>()

const getOperatorForType = (type: string): FilterOperator => {
  switch (type) {
    case 'number':
      return 'eq'
    case 'date':
      return 'eq'
    case 'boolean':
      return 'eq'
    case 'select':
      return 'eq'
    case 'range':
      return 'between'
    case 'text':
    default:
      return 'contains'
  }
}

const op = computed<FilterOperator>(() => getOperatorForType(props.filterConfig.type))
const value = ref<string | number>('')
const boolValue = ref<boolean>(false)

const rangeFrom = ref<string>('')
const rangeTo = ref<string>('')

const selectOptions = computed<SelectOption[]>(() => {
  const opts: FilterOption[] = props.filterConfig.options ?? []
  return [
    { label: '—', value: '' },
    ...opts.map(o => ({ label: o.label, value: o.value }))
  ]
})

watch(() => props.modelValue, (newValue) => {
  if (!newValue) {
    value.value = ''
    boolValue.value = false
    rangeFrom.value = ''
    rangeTo.value = ''
    return
  }

  if ('op' in newValue && newValue.op === 'between' && Array.isArray(newValue.value)) {
    rangeFrom.value = String(newValue.value[0] ?? '')
    rangeTo.value = String(newValue.value[1] ?? '')
  } else if ('op' in newValue) {
    if (props.filterConfig.type === 'boolean') {
      boolValue.value = Boolean(newValue.value)
    } else {
      value.value = newValue.value as string | number
    }
  }
}, { immediate: true })

watch([op, value, boolValue, rangeFrom, rangeTo], () => {
  let output: FilterOutput = null

  if (op.value === 'between') {
    if (rangeFrom.value && rangeTo.value) {
      output = { op: 'between', value: [rangeFrom.value, rangeTo.value] }
    }
  } else if (props.filterConfig.type === 'boolean') {
    output = { op: op.value, value: boolValue.value }
  } else if (props.filterConfig.type === 'number') {
    const num = typeof value.value === 'number' ? value.value : Number(value.value)
    if (!isNaN(num) && value.value !== '') {
      output = { op: op.value, value: num }
    }
  } else if (props.filterConfig.type === 'date') {
    const dateStr = String(value.value)
    if (dateStr && dateStr !== '') {
      output = { op: op.value, value: dateStr }
    }
  } else {
    const textValue = String(value.value)
    if (textValue && textValue !== '') {
      output = { op: op.value, value: textValue }
    }
  }

  emit('update', output)
}, { deep: true })
</script>
