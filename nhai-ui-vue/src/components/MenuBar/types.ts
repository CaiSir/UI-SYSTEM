export interface MenuItem {
  id: string | number
  label: string
  icon?: string
  disabled?: boolean
  children?: MenuItem[]
}

