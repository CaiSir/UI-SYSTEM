<template>
  <el-select
    v-model="selectValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :clearable="clearable"
    :multiple="multiple"
    :size="size"
    :options="options"
    @change="handleChange"
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElSelect, ElOption } from 'element-plus'

interface SelectOption {
  label: string
  value: string | number
}

interface Props {
  modelValue?: string | number | Array<string | number>
  placeholder?: string
  disabled?: boolean
  clearable?: boolean
  multiple?: boolean
  size?: 'large' | 'default' | 'small'
  options?: SelectOption[]
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '请选择',
  disabled: false,
  clearable: false,
  multiple: false,
  options: () => []
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
  (e: 'change', value: any): void
}>()

const selectValue = ref(props.modelValue)

watch(() => props.modelValue, (newValue) => {
  selectValue.value = newValue
})

watch(selectValue, (newValue) => {
  emit('update:modelValue', newValue)
})

const handleChange = (value: any) => {
  emit('change', value)
}
</script>

<style scoped>
</style>

