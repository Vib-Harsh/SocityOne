import React, { useState, useCallback, useMemo } from "react";
import { ListRenderer } from "@/components";
import type {
  TableColumn,
  TableAction,
  ListPagination,
  userList,
  filterParams,
} from "@/types";
import { Edit2, Trash2, Eye } from "lucide-react";
import { actions } from "@/constant/common";
import { userService } from "@/services";

const COLUMNS: TableColumn<userList>[] = [
  { value: "id", displayKey: "Id" },
  { value: "name", displayKey: "Full Name" },
  { value: "email", displayKey: "Email Address" },
  { value: "role", displayKey: "Role" },
];

const ACTIVE_PERMISSIONS = ["user:view", "user:edit", "user:delete"];

const INITIAL_PAGINATION: ListPagination<userList> = {
  page_index: 0,
  page_size: 5,
  sort_key: "id",
  sort_value: "DESC",
  total_count: 0,
};

const UserMaster: React.FC = () => {
  const [users, setUsers] = useState<userList[]>([]);
  const [search, setSearch] = useState<string>("");
  const [pagination, setPagination] =
    useState<ListPagination<userList>>(INITIAL_PAGINATION);

  const fetchUsers = async (
    searchVal: string,
    paginationVal: ListPagination<userList>,
  ) => {
    try {
      const payload: filterParams = {
        search: searchVal || undefined,
        page_index: paginationVal.page_index,
        page_size: paginationVal.page_size,
        sort_by: paginationVal.sort_key,
        sort_order: paginationVal.sort_value,
      };

      const response = await userService.getUsersList(payload);

      setUsers(response.data);
      setPagination({
        ...paginationVal,
        total_count: response.pagination.total_count,
      });
      setSearch(searchVal);
    } catch (e) {
      console.error("Error fetching users", e);
    }
  };

  const handleSearch = useCallback(
    (value: string) => {
      fetchUsers(value, {
        ...pagination,
        page_index: 0,
      });
    },
    [pagination],
  );

  const handlePagination = useCallback(
    (paginationParam: ListPagination<userList>) => {
      fetchUsers(search, paginationParam);
    },
    [search],
  );

  const handleAction = useCallback((action: string, record?: userList) => {
    console.log("Action", action);
    console.log("Record", record);
  }, []);

  const handleAdd = useCallback(() => {
    handleAction(actions.add);
  }, [handleAction]);

  const tableActions = useMemo<TableAction<userList>[]>(
    () => [
      {
        label: "View Profile",
        key: actions.view,
        icon: Eye,
        permission: "user:view",
        onPress: handleAction,
      },
      {
        label: "Edit User",
        key: actions.edit,
        icon: Edit2,
        permission: "user:edit",
        onPress: handleAction,
      },
      {
        label: "Delete User",
        key: actions.delete,
        icon: Trash2,
        permission: "user:delete",
        onPress: handleAction,
      },
    ],
    [handleAction],
  );

  const rendererProperties = useMemo(
    () => ({
      onSearch: handleSearch,
      searchPlaceholder: "Search by name, email",
      showAddButton: true,
      pagination: pagination,
      onPagination: handlePagination,
    }),
    [handleSearch, handlePagination, pagination],
  );

  return (
    <div className="">
      <ListRenderer<userList>
        title="User Management"
        description="View, manage, and verify all registered society members, administrators, and staff profiles."
        onAdd={handleAdd}
        columns={COLUMNS}
        data={users}
        tableActions={tableActions}
        permissions={ACTIVE_PERMISSIONS}
        properties={rendererProperties}
      />
    </div>
  );
};

export default UserMaster;
