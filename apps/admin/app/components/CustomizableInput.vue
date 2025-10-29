<template>
  <UFormField :label="label">
    <template v-if="customComponent">
      <component :is="customComponent" v-model="innerValue" v-bind="componentProps" />
    </template>

    <template v-else>
      <template v-if="type === 'range'">
        <div class="flex gap-2">
          <UInput v-model="rangeFrom" :type="subTypeFrom || 'text'" size="sm" placeholder="From" />
          <UInput v-model="rangeTo" :type="subTypeTo || 'text'" size="sm" placeholder="To" />
        </div>
      </template>

      <template v-else-if="type === 'select'">
        <USelect v-model="innerValue" :options="options" size="sm" />
      </template>

      <template v-else-if="type === 'boolean'">
        <UCheckbox v-model="innerValue" />
      </template>

      <template v-else-if="type === 'number'">
        <UInput v-model.number="innerValue" type="number" size="sm" />
      </template>

      <template v-else-if="type === 'date'">
        <UInput v-model="innerValue" type="date" size="sm" />
      </template>

      <template v-else>
        <UInput v-model="innerValue" type="text" size="sm" />
      </template>
    </template>
  </UFormField>
</template>

<script setup lang="ts">
import { toRaw } from 'vue'

const props = defineProps<{
  label?: string
  modelValue: any
  type?: string
  options?: { label: string; value: string }[]
  customComponent?: any
  componentProps?: Record<string, any>
  subTypeFrom?: string
  subTypeTo?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: any): void
}>()

const innerValue = ref(props.modelValue)
const rangeFrom = ref('')
const rangeTo = ref('')

watch(() => props.modelValue, (v) => {
  innerValue.value = v
  if (props.type === 'range') {
    if (Array.isArray(v)) {
      rangeFrom.value = String(v[0] ?? '')
      rangeTo.value = String(v[1] ?? '')
    } else {
      rangeFrom.value = ''
      rangeTo.value = ''
    }
  }
}, { immediate: true })

watch([innerValue], () => {
  if (props.type !== 'range') emit('update:modelValue', toRaw(innerValue.value))
})

watch([rangeFrom, rangeTo], () => {
  if (props.type === 'range') {
    if (rangeFrom.value !== '' || rangeTo.value !== '') {
      emit('update:modelValue', [rangeFrom.value || null, rangeTo.value || null])
    } else {
      emit('update:modelValue', null)
    }
  }
})
</script>
