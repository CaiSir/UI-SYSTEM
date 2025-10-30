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
    @input="handleInput"
    ref="inputRef"
  />
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue'
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
  (e: 'input', value: string): void
}>()

const inputValue = ref(props.modelValue || '')
const inputRef = ref<InstanceType<typeof ElInput>>()

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

const handleInput = (value: string) => {
  emit('input', value)
}

// 暴露方法给父组件
defineExpose({
  setValue: (value: string) => {
    inputValue.value = value
  },
  getValue: (): string => {
    return inputValue.value
  },
  focus: () => {
    nextTick(() => {
      inputRef.value?.focus()
    })
  },
  blur: () => {
    nextTick(() => {
      inputRef.value?.blur()
    })
  },
  clear: () => {
    inputValue.value = ''
  }
})
</script>