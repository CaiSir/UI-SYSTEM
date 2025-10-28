<template>
  <el-checkbox
    v-model="checkboxValue"
    :disabled="disabled"
    :size="size"
    :indeterminate="indeterminate"
    :label="label"
    @change="handleChange"
  >
    {{ text }}
  </el-checkbox>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElCheckbox } from 'element-plus'

interface Props {
  modelValue?: boolean
  label?: string | number
  text?: string
  disabled?: boolean
  size?: 'large' | 'default' | 'small'
  indeterminate?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  disabled: false,
  size: 'default',
  indeterminate: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'change', value: boolean): void
}>()

const checkboxValue = ref(props.modelValue)

watch(() => props.modelValue, (newValue) => {
  checkboxValue.value = newValue
})

watch(checkboxValue, (newValue) => {
  emit('update:modelValue', newValue)
})

const handleChange = (value: string | number | boolean) => {
  const boolValue = typeof value === 'boolean' ? value : Boolean(value)
  emit('change', boolValue)
}
</script>

