<template>
  <el-input
    v-model="inputValue"
    :type="type"
    :placeholder="placeholder"
    :disabled="disabled"
    :clearable="clearable"
    :show-password="showPassword"
    :prefix-icon="prefixIcon"
    :suffix-icon="suffixIcon"
    :maxlength="maxlength"
    :minlength="minlength"
    :size="size"
    @blur="handleBlur"
    @focus="handleFocus"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElInput } from 'element-plus'

interface Props {
  modelValue?: string
  type?: 'text' | 'textarea' | 'password'
  placeholder?: string
  disabled?: boolean
  clearable?: boolean
  showPassword?: boolean
  prefixIcon?: string
  suffixIcon?: string
  maxlength?: number
  minlength?: number
  size?: 'large' | 'default' | 'small'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '请输入',
  disabled: false,
  clearable: false,
  showPassword: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'blur', event: FocusEvent): void
  (e: 'focus', event: FocusEvent): void
  (e: 'change', value: string): void
}>()

const inputValue = ref(props.modelValue || '')

// 同步外部值变化
watch(() => props.modelValue, (newValue) => {
  inputValue.value = newValue || ''
})

// 监听输入变化
watch(inputValue, (newValue) => {
  emit('update:modelValue', newValue)
})

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}

const handleChange = (value: string) => {
  emit('change', value)
}
</script>

<style scoped>
</style>

