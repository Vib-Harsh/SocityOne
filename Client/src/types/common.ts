export type action_key =
  | "add"
  | "edit"
  | "delete"
  | "view"
  | "export"
  | "import";

export type filterParams = {
  search?: string;
  page_size?: number;
  page_index?: number;
  sort_by?: string;
  sort_order?: "ASC" | "DESC";
};
