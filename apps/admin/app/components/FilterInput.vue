<template>
  <div class="flex flex-col gap-1 min-w-[180px]">
    <CustomizableInput :label="label" :type="filterConfig.type" v-model="inputModel" :options="selectOptions"
      :subTypeFrom="filterConfig.type === 'range' ? 'date' : undefined"
      :subTypeTo="filterConfig.type === 'range' ? 'date' : undefined" :placeholder="`Filter by ${label} ...`" />
  </div>
</template>

<script setup lang="ts">
import type { FilterConfig, FilterOption, InputType } from '~/types/table-types'
import type { FilterCondition, FilterOperator } from '@pawspot/api-contracts'
import CustomizableInput from '~/components/CustomizableInput.vue'
import { toRaw } from 'vue'

type FilterOutput = FilterCondition | null

const props = defineProps<{
  filterConfig: FilterConfig
  field: string
  label: string
  modelValue?: FilterOutput
}>()

const emit = defineEmits<{
  (e: 'update', value: FilterOutput): void
}>()

const getOperatorForType = (type: InputType): FilterOperator => {
  switch (type) {
    case 'number':
    case 'date':
    case 'boolean':
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

interface SelectOption {
  label: string
  value: string
}

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


const inputModel = computed({
  get() {
    const t = props.filterConfig.type
    if (t === 'range') {
      return [rangeFrom.value || null, rangeTo.value || null]
    }
    if (t === 'boolean') return boolValue.value
    return value.value
  },
  set(v: any) {
    const t = props.filterConfig.type
    if (t === 'range') {
      if (Array.isArray(v)) {
        rangeFrom.value = v[0] == null ? '' : String(v[0])
        rangeTo.value = v[1] == null ? '' : String(v[1])
      } else {
        rangeFrom.value = ''
        rangeTo.value = ''
      }
    } else if (t === 'boolean') {
      boolValue.value = Boolean(v)
    } else {
      value.value = v ?? ''
    }
  }
})

watch([op, value, boolValue, rangeFrom, rangeTo], () => {
  let output: FilterOutput = null

  if (op.value === 'between') {
    if (rangeFrom.value && rangeTo.value) {
      output = { op: 'between', value: [rangeFrom.value, rangeTo.value] }
    } else {
      output = null
    }
  } else if (props.filterConfig.type === 'boolean') {
    output = { op: op.value, value: boolValue.value }
  } else if (props.filterConfig.type === 'number') {
    const num = typeof value.value === 'number' ? value.value : Number(value.value)
    if (!isNaN(num) && value.value !== '') {
      output = { op: op.value, value: num }
    } else {
      output = null
    }
  } else if (props.filterConfig.type === 'date') {
    const dateStr = String(value.value)
    if (dateStr && dateStr !== '') {
      output = { op: op.value, value: dateStr }
    } else {
      output = null
    }
  } else {
    const textValue = String(value.value)
    if (textValue && textValue !== '') {
      output = { op: op.value, value: textValue }
    } else {
      output = null
    }
  }

  emit('update', toRaw(output))
}, { deep: true })
</script>
