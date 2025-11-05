<template>
  <el-switch
    v-model="switchValue"
    :disabled="disabled"
    :size="size"
    :active-text="activeText"
    :inactive-text="inactiveText"
    :active-color="activeColor"
    :inactive-color="inactiveColor"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElSwitch } from 'element-plus'

interface Props {
  modelValue?: boolean
  disabled?: boolean
  size?: 'large' | 'default' | 'small'
  activeText?: string
  inactiveText?: string
  activeColor?: string
  inactiveColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  disabled: false,
  size: 'default'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'change', value: boolean): void
}>()

const switchValue = ref(props.modelValue)

watch(() => props.modelValue, (newValue) => {
  switchValue.value = newValue
})

watch(switchValue, (newValue) => {
  emit('update:modelValue', newValue)
})

const handleChange = (value: string | number | boolean) => {
  const boolValue = typeof value === 'boolean' ? value : Boolean(value)
  emit('change', boolValue)
}
</script>

