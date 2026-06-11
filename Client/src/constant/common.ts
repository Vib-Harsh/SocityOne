import type { action_key, ListPagination } from "@/types";

export const actions: Record<action_key, action_key> = {
  add: "add",
  edit: "edit",
  delete: "delete",
  view: "view",
  export: "export",
  import: "import",
};

export const INITIAL_PAGINATION = <T>(value: keyof T): ListPagination<T> => {
  return {
    page_index: 0,
    page_size: 5,
    sort_key: value,
    sort_value: "DESC",
    total_count: 0,
  };
};
