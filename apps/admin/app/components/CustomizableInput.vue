<template>
  <UFormField :label="label">
    <template v-if="customComponent">
      <component :is="customComponent" v-model="innerValue" v-bind="componentProps" />
    </template>

    <template v-else>
      <template v-if="type === 'range'">
        <div class="flex gap-2">
          <UInput ref="rangeFromRef" v-model="rangeFrom" :type="subTypeFrom || 'text'" :size="size"
            placeholder="From" />
          <UInput ref="rangeToRef" v-model="rangeTo" :type="subTypeTo || 'text'" :size="size" placeholder="To" />
        </div>
      </template>

      <template v-else-if="type === 'select'">
        <USelect v-model="innerValue" :items="options" :size="size" :placeholder="placeholder" />
      </template>

      <template v-else-if="type === 'boolean'">
        <UCheckbox v-model="innerValue" />
      </template>

      <template v-else-if="type === 'number'">
        <UInput ref="inputRef" v-model.number="innerValue" type="number" :size="size" :placeholder="placeholder" />
      </template>

      <template v-else-if="type === 'date'">
        <UInput ref="inputRef" v-model="innerValue" type="date" :size="size" :placeholder="placeholder" />
      </template>

      <template v-else-if="type === 'password'">
        <UInput ref="inputRef" v-model="innerValue" type="password" :size="size" :placeholder="placeholder" />
      </template>

      <template v-else>
        <UInput ref="inputRef" v-model="innerValue" type="text" :size="size" :placeholder="placeholder" />
      </template>
    </template>
  </UFormField>
</template>

<script setup lang="ts">
import type { InputType, SelectOption } from '~/types/table-types';

const props = defineProps<{
  label?: string
  modelValue: any
  type?: InputType
  options?: SelectOption[]
  useDefaultOption?: boolean
  customComponent?: any
  componentProps?: Record<string, any>
  subTypeFrom?: string
  subTypeTo?: string
  placeholder?: string
  size?: "sm" | "md" | "lg" | "xs" | "xl"
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: any): void
}>()

const innerValue = ref(props.modelValue)
const rangeFrom = ref('')
const rangeTo = ref('')
const inputRef = ref<HTMLInputElement | null>(null)
const rangeFromRef = ref<HTMLInputElement | null>(null)
const rangeToRef = ref<HTMLInputElement | null>(null)
const hasFocus = ref(false)

onMounted(() => {
  nextTick(() => {
    const input = getInputElement()
    if (input) {
      input.addEventListener('focus', handleFocus)
      input.addEventListener('blur', handleBlur)

      const shouldFocus = sessionStorage.getItem(`focus-${props.label}`)
      if (shouldFocus === 'true') {
        input.focus()
      }
    }
  })
})

onBeforeUnmount(() => {
  if (hasFocus.value) {
    sessionStorage.setItem(`focus-${props.label}`, 'true')
  } else {
    sessionStorage.removeItem(`focus-${props.label}`)
  }

  const input = getInputElement()
  if (input) {
    input.removeEventListener('focus', handleFocus)
    input.removeEventListener('blur', handleBlur)
  }
})

function getInputElement(): HTMLInputElement | null {
  if (props.type === 'range') {
    const activeEl = typeof document !== 'undefined' ? document.activeElement : null
    const fromInput = rangeFromRef.value?.$el?.querySelector('input')
    const toInput = rangeToRef.value?.$el?.querySelector('input')
    if (activeEl === fromInput) return fromInput
    if (activeEl === toInput) return toInput
    return fromInput || toInput
  }
  return inputRef.value?.$el?.querySelector('input')
}

function handleFocus() {
  hasFocus.value = true
}

function handleBlur() {
  hasFocus.value = false
}

watch(() => props.modelValue, (v, oldV) => {
  if (JSON.stringify(v) === JSON.stringify(oldV)) {
    return
  }

  if (innerValue.value !== v) {
    innerValue.value = v
  }
  if (props.type === 'range') {
    if (Array.isArray(v)) {
      const newFrom = String(v[0] ?? '')
      const newTo = String(v[1] ?? '')
      if (rangeFrom.value !== newFrom) rangeFrom.value = newFrom
      if (rangeTo.value !== newTo) rangeTo.value = newTo
    } else {
      if (rangeFrom.value !== '' || rangeTo.value !== '') {
        rangeFrom.value = ''
        rangeTo.value = ''
      }
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
