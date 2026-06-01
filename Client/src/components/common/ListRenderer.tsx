import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import type { TableColumn, ListRendererProps } from "@/types";
import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Mail,
  X,
  FileSpreadsheet,
} from "lucide-react";

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
const DEFAULT_DEBOUNCE_MS = 500;

const ListRenderer = <T,>({
  columns,
  data,
  title,
  description,
  onAdd,
  permissions,
  tableActions = [],
  properties,
}: ListRendererProps<T>) => {
  const [searchTerm, setSearchTerm] = useState("");

  const searchPlaceholder =
    properties?.searchPlaceholder ?? "Search columns...";
  const pageSizeOptions =
    properties?.pageSizeOptions ?? DEFAULT_PAGE_SIZE_OPTIONS;
  const debounceMs = properties?.debounceMs ?? DEFAULT_DEBOUNCE_MS;

  const onSearch = properties?.onSearch;
  const pagination = properties?.pagination;
  const onPagination = properties?.onPagination;

  const labels = useMemo(() => {
    return {
      actionsHeader: properties?.labels?.actionsHeader ?? "Actions",
      noEntriesTitle:
        properties?.labels?.noEntriesTitle ?? "No entries recorded",
      noEntriesDesc:
        properties?.labels?.noEntriesDesc ??
        "There is no active data currently matching the columns or search criteria provided.",
      addFirstEntry: properties?.labels?.addFirstEntry ?? "Add first entry",
      showingText:
        properties?.labels?.showingText ??
        ((start, end, total) => (
          <span>
            Showing{" "}
            <span className="font-semibold text-text-base">{start}</span> to{" "}
            <span className="font-semibold text-text-base">{end}</span> of{" "}
            <span className="font-semibold text-text-base">{total}</span>{" "}
            entries
          </span>
        )),
      showLabel: properties?.labels?.showLabel ?? "Show",
    };
  }, [properties?.labels]);

  // Debounced search logic to prevent performance bottlenecks on rapid keystrokes
  const onSearchRef = useRef(onSearch);
  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  useEffect(() => {
    if (!searchTerm) {
      onSearchRef.current?.("");
      return;
    }

    const handler = setTimeout(() => {
      onSearchRef.current?.(searchTerm);
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [searchTerm, debounceMs]);

  // Handle local text field edits
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    [],
  );

  // Clear search field
  const handleClearSearch = useCallback(() => {
    setSearchTerm("");
  }, []);

  // Handle sorting click callback
  const handleSort = useCallback(
    (colKey: keyof T) => {
      if (!pagination || !onPagination) return;
      let nextSortValue: "ASC" | "DESC" = "ASC";

      if (pagination.sort_key === colKey) {
        nextSortValue = pagination.sort_value === "ASC" ? "DESC" : "ASC";
      }

      onPagination({
        ...pagination,
        sort_key: colKey,
        sort_value: nextSortValue,
        page_index: 0,
      });
    },
    [pagination, onPagination],
  );

  // Filter actions against current permissions (Memoized)
  const allowedActions = useMemo(() => {
    return tableActions.filter((action) => {
      if (!permissions) return true;
      return !action.permission || permissions.includes(action.permission);
    });
  }, [tableActions, permissions]);

  // Memoized pagination calculations
  const hasPagination = !!pagination;

  const { totalPages, currentPage, startRow, endRow } = useMemo(() => {
    if (!hasPagination || !pagination) {
      return { totalPages: 0, currentPage: 0, startRow: 0, endRow: 0 };
    }
    const total = pagination.total_count;
    const size = pagination.page_size;
    const index = pagination.page_index;

    return {
      totalPages: Math.ceil(total / size),
      currentPage: index,
      startRow: total === 0 ? 0 : index * size + 1,
      endRow: Math.min((index + 1) * size, total),
    };
  }, [hasPagination, pagination]);

  // Page index trigger
  const handlePageChange = useCallback(
    (newPageIndex: number) => {
      if (
        hasPagination &&
        onPagination &&
        pagination &&
        newPageIndex >= 0 &&
        newPageIndex < totalPages
      ) {
        onPagination({
          ...pagination,
          page_index: newPageIndex,
        });
      }
    },
    [hasPagination, onPagination, pagination, totalPages],
  );

  // Page size dropdown selection trigger
  const handlePageSizeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (hasPagination && onPagination && pagination) {
        onPagination({
          ...pagination,
          page_size: Number(e.target.value),
          page_index: 0,
        });
      }
    },
    [hasPagination, onPagination, pagination],
  );

  // Highly optimized cell render pipeline
  const renderCell = (record: T, col: TableColumn<T>) => {
    const value = record[col.value as keyof T];
    if (value === undefined || value === null) {
      return (
        <span className="text-text-muted/40 font-mono select-none">-</span>
      );
    }

    const stringValue = String(value);

    // 1. Fully-dynamic value mapping with dual-theme hex color code overrides (using state-free CSS variables)
    if (col.formatValue && stringValue in col.formatValue) {
      const themeVal = col.formatValue[stringValue];
      const lightColor =
        typeof themeVal === "string" ? themeVal : themeVal.light;
      const darkColor = typeof themeVal === "string" ? themeVal : themeVal.dark;

      const isHex = lightColor.startsWith("#") || darkColor.startsWith("#");

      if (isHex) {
        const badgeStyle = {
          "--badge-color-light": lightColor,
          "--badge-color-dark": darkColor,
        } as React.CSSProperties;

        const badgeClass =
          "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border transition-all duration-200 " +
          "text-[var(--badge-color-light)] dark:text-[var(--badge-color-dark)] " +
          "bg-[color-mix(in_srgb,var(--badge-color-light)_10%,transparent)] dark:bg-[color-mix(in_srgb,var(--badge-color-dark)_15%,transparent)] " +
          "border-[color-mix(in_srgb,var(--badge-color-light)_20%,transparent)] dark:border-[color-mix(in_srgb,var(--badge-color-dark)_20%,transparent)]";

        return (
          <span className={badgeClass} style={badgeStyle}>
            {stringValue}
          </span>
        );
      }

      // Tailwind utility color mapping fallback (e.g. "emerald", "rose")
      const badgeClass = `inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border transition-all duration-200 bg-${lightColor}-500/10 text-${lightColor}-600 border-${lightColor}-500/20 dark:text-${darkColor}-400 dark:bg-${darkColor}-500/10 dark:border-${darkColor}-500/20`;

      return <span className={badgeClass}>{stringValue}</span>;
    }

    // 2. Email links with hover states and inline envelope icons
    if (
      String(col.value).toLowerCase() === "email" ||
      (stringValue.includes("@") && stringValue.includes("."))
    ) {
      return (
        <a
          href={`mailto:${stringValue}`}
          className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary-hover hover:underline transition-colors max-w-xs truncate"
          title={stringValue}
        >
          <Mail className="w-3.5 h-3.5 flex-shrink-0 opacity-60 text-text-muted" />
          <span className="truncate">{stringValue}</span>
        </a>
      );
    }

    // 3. Fallback Status formatting utilizing Tailwind v4 base color schemes
    if (
      String(col.value).toLowerCase() === "status" ||
      typeof value === "boolean"
    ) {
      const isTrue =
        value === true ||
        stringValue.toLowerCase() === "active" ||
        stringValue.toLowerCase() === "true";
      const isFalse =
        value === false ||
        stringValue.toLowerCase() === "inactive" ||
        stringValue.toLowerCase() === "false";

      let badgeClass =
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border bg-slate-500/10 text-slate-600 border-slate-500/20 dark:text-slate-400";

      if (isTrue) {
        badgeClass =
          "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400";
      } else if (isFalse) {
        badgeClass =
          "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400";
      } else if (stringValue.toLowerCase() === "pending") {
        badgeClass =
          "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400";
      }

      return <span className={badgeClass}>{stringValue}</span>;
    }

    // 4. Fallback Role rendering with distinct gradient animations for Super Admins
    if (String(col.value).toLowerCase() === "role") {
      const lowerRole = stringValue.toLowerCase();
      let badgeClass =
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border bg-indigo-500/10 text-indigo-600 border-indigo-500/20 dark:text-indigo-400";

      if (lowerRole.includes("super") || lowerRole.includes("owner")) {
        badgeClass =
          "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border bg-violet-500/15 text-violet-600 border-violet-500/30 dark:text-violet-400 animate-pulse";
      } else if (lowerRole.includes("admin")) {
        badgeClass =
          "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400";
      } else if (lowerRole.includes("guest") || lowerRole.includes("viewer")) {
        badgeClass =
          "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border bg-zinc-500/10 text-zinc-600 border-zinc-500/20 dark:text-zinc-400";
      }

      return <span className={badgeClass}>{stringValue}</span>;
    }

    // 5. Default text string truncated safely to prevent cell size overflows
    return (
      <span
        className="text-xs text-text-base max-w-[200px] truncate block"
        title={stringValue}
      >
        {stringValue}
      </span>
    );
  };

  return (
    <div className="w-full h-[calc(100vh-96px)] flex flex-col gap-4 fade-in-up overflow-hidden pb-1">
      {/* Sleek, Unified Header and Search Row (Compact & High-Focus) */}
      <div className="flex-shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-1.5 px-0.5">
        {/* Left: Compact Title & Subtitle */}
        <div className="flex flex-col gap-0.5">
          <h2 className="text-xl font-bold tracking-tight text-text-base">
            {title}
          </h2>
          {description && (
            <p className="text-[11px] text-text-muted leading-tight hidden sm:block opacity-85">
              {description}
            </p>
          )}
        </div>

        {/* Right: Consolidated Controls (Search & Add Button in one flex line) */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {properties?.onSearch && (
            <div className="relative w-full sm:w-60 md:w-72 xl:w-80">
              <Search className="w-3.5 h-3.5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-70" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-8.5 pr-8 py-1.5 text-xs rounded-xl border border-border-custom bg-bg-card/25 backdrop-blur-sm text-text-base placeholder-text-muted/50 focus:bg-bg-card/55 focus:outline-none focus:ring-2 focus:ring-violet-500/10 focus:border-violet-500/40 transition-all shadow-sm"
              />
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  className="p-1 rounded-full absolute right-2.5 top-1/2 -translate-y-1/2 hover:bg-black/5 dark:hover:bg-white/5 text-text-muted cursor-pointer transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          {((properties?.showAddButton !== false && onAdd) || onAdd) && (
            <button
              onClick={onAdd}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white rounded-xl shadow-md bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-violet-500/20 cursor-pointer flex-shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Dynamic Grid/Table Container (Fills remaining height, only table body scrolls) */}
      <div className="flex-1 min-h-0 relative rounded-2xl border border-border-custom bg-bg-card/20 backdrop-blur-sm shadow-md overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto w-full scrollbar-thin scrollbar-thumb-border-custom scrollbar-track-transparent">
          <table className="w-full border-collapse text-left">
            <thead className="sticky top-0 z-20 bg-bg-card/95 backdrop-blur-xl border-b border-border-custom shadow-sm">
              <tr className="bg-black/5 dark:bg-white/1 flex-nowrap">
                {columns.map((col) => {
                  const isSorted =
                    hasPagination && pagination?.sort_key === col.value;
                  const isSortable = hasPagination;

                  return (
                    <th
                      key={String(col.value)}
                      onClick={() => isSortable && handleSort(col.value)}
                      className={`px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider select-none ${
                        isSortable
                          ? "cursor-pointer hover:bg-black/5 dark:hover:bg-white/3 transition-colors"
                          : ""
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>{col.displayKey}</span>
                        {isSortable && (
                          <span className="opacity-80">
                            {isSorted ? (
                              pagination?.sort_value === "ASC" ? (
                                <ArrowUp className="w-3.5 h-3.5 text-primary" />
                              ) : (
                                <ArrowDown className="w-3.5 h-3.5 text-primary" />
                              )
                            ) : (
                              <ArrowUpDown className="w-3.5 h-3.5 opacity-30 hover:opacity-100 transition-opacity" />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}

                {allowedActions.length > 0 && (
                  <th className="sticky right-0 px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider text-right bg-bg-card/90 backdrop-blur-xl border-l border-border-custom/50 shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.03)] dark:shadow-[-10px_0_15px_-3px_rgba(255,255,255,0.01)]">
                    {labels.actionsHeader}
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-border-custom/40">
              {data.length > 0 ? (
                data.map((record, index) => (
                  <tr
                    key={index}
                    className="hover:bg-violet-500/[0.02] dark:hover:bg-violet-400/[0.02] transition-colors duration-150 group"
                  >
                    {columns.map((col) => (
                      <td
                        key={String(col.value)}
                        className="px-6 py-4 align-middle"
                      >
                        {renderCell(record, col)}
                      </td>
                    ))}

                    {allowedActions.length > 0 && (
                      <td className="sticky right-0 px-6 py-4 text-right align-middle bg-bg-card/85 backdrop-blur-xl border-l border-border-custom/50 shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.03)] dark:shadow-[-10px_0_15px_-3px_rgba(255,255,255,0.01)]">
                        <div className="flex items-center justify-end gap-2.5">
                          {allowedActions.map((action) => {
                            const ActionIcon = action.icon;

                            let btnClass =
                              "p-1.5 rounded-lg border border-border-custom hover:scale-[1.05] active:scale-[0.95] text-text-muted transition-all duration-200 cursor-pointer";
                            if (action.key === "edit") {
                              btnClass =
                                "p-1.5 rounded-lg border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 hover:border-amber-500/40 text-amber-600 dark:text-amber-400 hover:scale-[1.05] active:scale-[0.95] transition-all duration-200 cursor-pointer";
                            } else if (action.key === "delete") {
                              btnClass =
                                "p-1.5 rounded-lg border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 hover:border-red-500/40 text-red-600 dark:text-red-400 hover:scale-[1.05] active:scale-[0.95] transition-all duration-200 cursor-pointer";
                            } else if (action.key === "view") {
                              btnClass =
                                "p-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:scale-[1.05] active:scale-[0.95] transition-all duration-200 cursor-pointer";
                            } else if (
                              action.key === "export" ||
                              action.key === "import"
                            ) {
                              btnClass =
                                "p-1.5 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 text-primary hover:scale-[1.05] active:scale-[0.95] transition-all duration-200 cursor-pointer";
                            }

                            return (
                              <button
                                key={String(action.key)}
                                onClick={() =>
                                  action.onPress(action.key, record)
                                }
                                className={btnClass}
                                title={action.label}
                              >
                                <ActionIcon className="w-4 h-4 flex-shrink-0" />
                              </button>
                            );
                          })}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                /* Dynamic Glassmorphic Empty State */
                <tr>
                  <td
                    colSpan={
                      columns.length + (allowedActions.length > 0 ? 1 : 0)
                    }
                    className="py-16 px-6"
                  >
                    <div className="flex flex-col items-center justify-center text-center gap-4 fade-in-up">
                      <div className="w-16 h-16 rounded-2xl bg-black/5 dark:bg-white/5 border border-border-custom/50 flex items-center justify-center text-text-muted/40 shadow-inner">
                        <FileSpreadsheet className="w-8 h-8 opacity-60" />
                      </div>
                      <div className="max-w-sm">
                        <h4 className="text-sm font-bold text-text-base">
                          {labels.noEntriesTitle}
                        </h4>
                        <p className="text-xs text-text-muted mt-1 leading-normal">
                          {labels.noEntriesDesc}
                        </p>
                      </div>
                      {onAdd && (
                        <button
                          onClick={onAdd}
                          className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-primary/30 text-primary rounded-lg hover:bg-primary/5 cursor-pointer transition-all active:scale-[0.97]"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{labels.addFirstEntry}</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Footnote & Pagination Blocks */}
      {hasPagination && totalPages > 0 && pagination && (
        <div className="flex-shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border border-border-custom/60 bg-bg-card/10 backdrop-blur-sm">
          <div className="flex items-center gap-3 text-xs text-text-muted">
            {labels.showingText(startRow, endRow, pagination.total_count)}

            <div className="h-4 w-px bg-border-custom/60 hidden sm:block" />

            <div className="flex items-center gap-1.5">
              <span>{labels.showLabel}</span>
              <select
                value={pagination.page_size}
                onChange={handlePageSizeChange}
                className="px-2 py-0.5 border border-border-custom rounded-md bg-bg-card text-xs text-text-base focus:outline-none focus:ring-1 focus:ring-primary/45 cursor-pointer shadow-sm"
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className={`p-1.5 rounded-lg border border-border-custom focus:outline-none transition-colors shadow-sm ${
                currentPage === 0
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:bg-black/5 dark:hover:bg-white/5 text-text-base cursor-pointer"
              }`}
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }).map((_, index) => {
              const isFirst = index === 0;
              const isLast = index === totalPages - 1;
              const isNear = Math.abs(index - currentPage) <= 1;

              if (isFirst || isLast || isNear) {
                return (
                  <button
                    key={index}
                    onClick={() => handlePageChange(index)}
                    className={`min-w-[28px] h-7 px-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                      currentPage === index
                        ? "bg-primary text-white border-primary shadow-sm hover:bg-primary-hover"
                        : "border-border-custom hover:bg-black/5 dark:hover:bg-white/5 text-text-muted hover:text-text-base"
                    }`}
                  >
                    {index + 1}
                  </button>
                );
              }

              if (index === 1 || index === totalPages - 2) {
                return (
                  <span
                    key={index}
                    className="px-1 text-xs text-text-muted opacity-50 select-none"
                  >
                    ...
                  </span>
                );
              }

              return null;
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
              className={`p-1.5 rounded-lg border border-border-custom focus:outline-none transition-colors shadow-sm ${
                currentPage === totalPages - 1
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:bg-black/5 dark:hover:bg-white/5 text-text-base cursor-pointer"
              }`}
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListRenderer;
