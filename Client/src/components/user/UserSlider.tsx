import React, { useEffect, useMemo, useState } from "react";
import type { action_key, FieldInterface, User, UserForm } from "@/types";
import FormRenderer from "../common/FormRenderer";
import { actions } from "@/constant/common";
import FieldRenderer from "../common/FieldRender";
import { roleService, userService } from "@/services";
import { Form } from "antd";

type UserSliderProps = {
  visible: boolean;
  mode: action_key;
  onClose: () => void;
  onReload: () => void;
  item?: User | null;
};

const defaultUser: UserForm & { confirm_password?: string } = {
  email: "",
  is_active: true,
  name: "",
  password: "",
  confirm_password: "",
  role_id: 0,
};
const UserSlider: React.FC<UserSliderProps> = ({
  visible,
  mode,
  onClose,
  onReload,
  item,
}) => {
  const [form] = Form.useForm();
  const [formdata, setFormdata] = useState<UserForm>(defaultUser);

  useEffect(() => {
    if (visible) {
      const initialVals = item ? { ...item } : defaultUser;
      // setFormdata(initialVals);
      form.setFieldsValue(initialVals);
    } else {
      form.resetFields();
    }
  }, [visible, item, form]);

  const getText = useMemo<{
    title: string;
    description: string;
    buttonText: string;
  }>(() => {
    switch (mode) {
      case actions.add:
        return {
          title: "Add New User",
          description: "Register a new user account with administrative roles.",
          buttonText: "Create User",
        };
      case actions.edit:
        return {
          title: "Edit User Profile",
          description: "Modify active user account attributes and permissions.",
          buttonText: "Save Changes",
        };
      case actions.view:
        return {
          title: "User Profile Details",
          description: "View detailed read-only records of the selected user.",
          buttonText: "",
        };
      default:
        return { title: "User Details", description: "", buttonText: "" };
    }
  }, [mode]);

  const handleSave = async (
    payload: UserForm & { confirm_password?: string },
  ) => {
    try {
      if (mode === actions.add) {
        await userService.createUser(payload);
      } else if (mode === actions.edit && item) {
        await userService.updateUser(item.id, payload);
      }
      onReload();
      onClose();
    } catch (e) {
      console.error("Error saving user:", e);
    }
  };

  const FieldInfo = useMemo<
    FieldInterface<UserForm & { confirm_password?: string }>[]
  >(() => {
    const field: FieldInterface<UserForm & { confirm_password?: string }>[] = [
      {
        type: "INPUT",
        key: "name",
        label: "Full Name",
        disable: mode === actions.view,
        input_type: "default",
        placeholder: "Please enter full name",
        isRequired: true,
        validation: {
          minLength: 3,
          maxLength: 256,
          lengthMessage: "Full name must be between 3 and 256 characters.",
        },
      },
      {
        type: "INPUT",
        key: "email",
        label: "Email Address",
        disable: mode === actions.view,
        input_type: "email",
        placeholder: "Please enter email address",
        isRequired: true,
        validation: {
          minLength: 3,
          maxLength: 256,
          lengthMessage: "Email address must be between 3 and 256 characters.",
          regexp: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
          regexp_message: "Please enter a valid email address.",
        },
      },
      {
        type: "SELECT_OBJECT",
        key: "role_id",
        label: "Role",
        display_key: "name",
        value_key: "id",
        disable: mode === actions.view,
        placeholder: "Please select role",
        isRequired: true,
        fetchOption: async () => {
          const roles = await roleService.getRoles();
          return roles;
        },
      },
    ];
    if (mode === actions.add) {
      field.push({
        type: "INPUT",
        key: "password",
        label: "Password",
        disable: mode === actions.view,
        input_type: "password",
        placeholder: "Please enter password",
        isRequired: true,
        validation: {
          minLength: 6,
          maxLength: 256,
          lengthMessage: "Password must be between 6 and 256 characters.",
        },
      });
      field.push({
        type: "INPUT",
        key: "confirm_password",
        label: "Confirm Password",
        disable: mode === actions.view,
        input_type: "password",
        placeholder: "Please enter confirm password",
        isRequired: true,
        validation: {
          minLength: 6,
          maxLength: 256,
          lengthMessage: "Password must be between 6 and 256 characters.",
        },
      });
    }
    return field;
  }, [mode]);

  return (
    <FormRenderer
      form={form}
      visible={visible}
      renderItem="drawer"
      onClose={onClose}
      width={450}
      headerProperties={{
        title: getText.title,
        description: getText.description,
      }}
      footerProperties={{
        showSubmit: mode !== actions.view,
        submitText: getText.buttonText,
        onSubmit: handleSave,
      }}
    >
      <FieldRenderer<UserForm & { confirm_password?: string }>
        form={form}
        fieldInfo={FieldInfo}
        formdata={formdata}
        setFormdata={setFormdata}
        disabled={mode === actions.view}
      />
    </FormRenderer>
  );
};

export default UserSlider;
