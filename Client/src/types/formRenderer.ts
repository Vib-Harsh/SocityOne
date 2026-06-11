import type { Dispatch, SetStateAction } from "react";
import React from "react";
import type { FormInstance } from "antd";

type field_common_types<T> = {
  key: keyof T;
  label: string;
  disable?: boolean;
  dependency_field?: string;
  isRequired?: boolean;
  // type: 'INPUT'|'SELECT'|'SELECT_OBJECT'|'SWITCH'|'DATEPICKER'|'DATETIME_PICKER'|'CHECKBOX'|'RADIO_BUTTON'|'CUSTOM'
};
export type INPUT_PROPS<T> = {
  type: "INPUT";
  placeholder?: string;
  input_type?: "number" | "email" | "password" | "default";
  onChange?: (value: string) => void;
  validation?: {
    maxLength?: number;
    minLength?: number;
    lengthMessage?: string;
    regexp?: string;
    regexp_message?: string;
  };
} & field_common_types<T>;

export type SELECT_PROPS<T> = {
  type: "SELECT";
  placeholder?: string;
  options?: Array<string>;
  fetchOption?: () => Promise<Array<string>>;
  onChange?: (value: unknown) => void;
} & field_common_types<T>;

export type SELECT_OBJECT_PROPS<T> = {
  type: "SELECT_OBJECT";
  placeholder?: string;
  options?: Array<Record<string, string | number | boolean>>;
  value_key: string;
  display_key: string;
  fetchOption?: (
    formdata: T,
  ) => Promise<Array<Record<string, string | number | boolean>>>;
  onChange?: (value: Record<string, string | number | boolean>) => void;
} & field_common_types<T>;

export type RADIO_PROPS<T> = {
  type: "RADIO";
  options: Array<string>;
  onChange?: (value: string) => void;
} & field_common_types<T>;

export type CHECKBOX_PROPS<T> = {
  type: "CHECKBOX";
  options: Array<string>;
  onChange?: (checkedValues: string[]) => void;
} & field_common_types<T>;

export type SWITCH_PROPS<T> = {
  type: "SWITCH";
  checkedChildren?: React.ReactNode;
  unCheckedChildren?: React.ReactNode;
  onChange?: (checked: boolean) => void;
} & field_common_types<T>;

export type BUTTON_PROPS<T> = {
  type: "BUTTON";
  buttonText?: string;
  onClick?: () => void;
  buttonType?: "primary" | "dashed" | "link" | "text" | "default";
  danger?: boolean;
} & field_common_types<T>;

export type FieldInterface<T> =
  | INPUT_PROPS<T>
  | SELECT_PROPS<T>
  | SELECT_OBJECT_PROPS<T>
  | RADIO_PROPS<T>
  | CHECKBOX_PROPS<T>
  | SWITCH_PROPS<T>
  | BUTTON_PROPS<T>;

export type FieldRendererProps<T> = {
  formdata: T;
  setFormdata: Dispatch<SetStateAction<T>>;
  fieldInfo: FieldInterface<T>[];
  disabled?: boolean;
  form?: FormInstance;
};

export interface HeaderProperties {
  title?: React.ReactNode;
  description?: React.ReactNode;
  showClose?: boolean;
  extraHeaderActions?: React.ReactNode;
}

export interface FooterProperties {
  showCancel?: boolean;
  cancelText?: string;
  onCancel?: () => void;
  showSubmit?: boolean;
  submitText?: string;
  onSubmit?: (values?: any) => void;
  submitLoading?: boolean;
  submitDisabled?: boolean;
  cancelDisabled?: boolean;
  cancelLoading?: boolean;
  extraActions?: React.ReactNode;
}

export interface FormRendererProps {
  visible: boolean;
  renderItem: "modal" | "drawer";
  onClose: () => void;
  headerProperties?: HeaderProperties;
  footerProperties?: FooterProperties;
  width?: number | string;
  backdropBlur?: boolean;
  children?: React.ReactNode;
  className?: string;
  form?: FormInstance;
}
