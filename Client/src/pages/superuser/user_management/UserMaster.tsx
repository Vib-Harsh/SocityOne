import React, { useState, useCallback, useMemo } from "react";
import { ListRenderer, UserSlider, DeleteModal } from "@/components";
import type {
  TableColumn,
  TableAction,
  ListPagination,
  UserList,
  filterParams,
  ListModal,
  action_key,
  User,
} from "@/types";
import { Edit2, Trash2, Eye } from "lucide-react";
import { actions, INITIAL_PAGINATION } from "@/constant/common";
import { userService } from "@/services";

const COLUMNS: TableColumn<UserList>[] = [
  { value: "id", displayKey: "Id" },
  { value: "name", displayKey: "Full Name" },
  { value: "email", displayKey: "Email Address" },
  { value: "role", displayKey: "Role" },
];

const ACTIVE_PERMISSIONS = ["user:view", "user:edit", "user:delete"];

const UserMaster: React.FC = () => {
  const [users, setUsers] = useState<UserList[]>([]);
  const [search, setSearch] = useState<string>("");
  const [pagination, setPagination] = useState<ListPagination<UserList>>(
    INITIAL_PAGINATION<UserList>("id"),
  );
  const [modal, setModal] = useState<ListModal<User>>({
    show: false,
    action: "",
    item: null,
    loading: false,
  });

  const fetchUsers = async (
    searchVal: string,
    paginationVal: ListPagination<UserList>,
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
    (paginationParam: ListPagination<UserList>) => {
      fetchUsers(search, paginationParam);
    },
    [search],
  );
  const handleAction = useCallback(
    async (action: action_key, record?: UserList) => {
      let user = null;
      if (record) {
        user = await userService.getUser(record.id);
      }
      setModal({
        show: true,
        action,
        item: user || null,
        loading: false,
      });
    },
    [],
  );
  const handleCloseModal = useCallback(() => {
    setModal({
      show: false,
      action: "",
      item: null,
      loading: false,
    });
  }, []);

  const handleDeleteUser = async () => {
    if (!modal.item) return;
    try {
      setModal((prev) => ({
        ...prev,
        loading: true,
      }));
      await userService.deleteUser(modal.item.id);
      fetchUsers(search, pagination);
      handleCloseModal();
    } catch (e) {
      console.error("Error deleting user", e);
      setModal((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  };

  const tableActions = useMemo<TableAction<UserList>[]>(
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
    <div>
      <UserSlider
        mode={modal.action as action_key}
        onClose={handleCloseModal}
        visible={modal.show && modal.action !== actions.delete}
        onReload={() => fetchUsers(search, pagination)}
        item={modal.item}
      />
      <DeleteModal
        visible={modal.show && modal.action === actions.delete}
        onClose={handleCloseModal}
        onDelete={handleDeleteUser}
        itemName={modal.item?.name}
        title="Delete User"
        description="Are you sure you want to permanently delete user"
        confirmLoading={modal.loading}
      />
      <ListRenderer<UserList>
        title="User Management"
        description="View, manage, and verify all registered society members, administrators, and staff profiles."
        onAdd={() => handleAction(actions.add)}
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
