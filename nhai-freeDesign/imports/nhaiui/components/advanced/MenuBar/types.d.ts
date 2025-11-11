export interface MenuItem {
    id: string | number;
    label: string;
    icon?: string | object;
    disabled?: boolean;
    children?: MenuItem[];
}