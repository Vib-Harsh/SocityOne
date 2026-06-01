import type { action_key } from "./common";
import type { LucideIcon } from "lucide-react";

export type TableAction<T> = {
  label: string;
  key: action_key;
  icon: LucideIcon;
  permission: string;
  onPress: (action: action_key, record: T) => void;
};

export type ThemeValue = string | { light: string; dark: string };

export type TableColumn<T> = {
  value: keyof T;
  displayKey: string;
  formatValue?: Record<string, ThemeValue>; // Custom coloring mapping (supports hex colors, Tailwind class colors, or distinct light/dark objects)
};

export type ListPagination<T> = {
  page_index: number;
  page_size: number;
  sort_key: keyof T;
  sort_value: "ASC" | "DESC";
  total_count: number;
};

export type ListProperties<T> = {
  onSearch: (searchValue: string) => void;
  searchPlaceholder?: string;
  showAddButton?: boolean;
  pagination?: ListPagination<T>;
  onPagination?: (pagination: ListPagination<T>) => void;
  pageSizeOptions?: number[]; // Customizable page sizes options
  debounceMs?: number; // Customizable search debounce timing
  labels?: {
    actionsHeader?: string;
    noEntriesTitle?: string;
    noEntriesDesc?: string;
    addFirstEntry?: string;
    showingText?: (
      start: number,
      end: number,
      total: number,
    ) => React.ReactNode;
    showLabel?: string;
  };
};

export type ListRendererProps<T> = {
  title: string;
  description?: string;
  onAdd?: () => void;
  tableActions?: Array<TableAction<T>>;
  permissions?: string[];
  properties?: ListProperties<T>;
  columns: TableColumn<T>[];
  data: Array<T>;
};
