import type {
  FieldInterface,
  FieldRendererProps,
  INPUT_PROPS,
  SELECT_PROPS,
  SELECT_OBJECT_PROPS,
  RADIO_PROPS,
  CHECKBOX_PROPS,
  SWITCH_PROPS,
  BUTTON_PROPS,
} from "@/types/formRenderer";
import {
  ConfigProvider,
  Form,
  Input,
  Radio,
  Checkbox,
  Switch,
  Select,
  Button,
} from "antd";
import { Eye, EyeOff } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useEffect, useRef, useState } from "react";
import type { Rule } from "antd/es/form";

interface RenderFieldItemProps<T> {
  field: FieldInterface<T>;
  formdata: T;
  handleInputChange: (val: unknown) => void;
  disabled: boolean;
}

const getFormItemRules = <_T,>(f: FieldInterface<_T>): Rule[] => {
  const rules: Rule[] = [];
  if (f.isRequired) {
    rules.push({ required: true, message: `${f.label} is required` });
  }

  if (f.type === "INPUT" && f.validation) {
    const v = f.validation;
    if (v.minLength !== undefined || v.maxLength !== undefined) {
      rules.push({
        min: v.minLength,
        max: v.maxLength,
        message:
          v.lengthMessage ||
          `${f.label} must be between ${v.minLength} and ${v.maxLength} characters`,
      });
    }
    if (v.regexp) {
      rules.push({
        pattern: new RegExp(v.regexp),
        message: v.regexp_message || `${f.label} format is invalid`,
      });
    }
  }
  return rules;
};

function useFieldOptions<T>(
  field: FieldInterface<T>,
  formdata: T,
  fetchOption: unknown,
  staticOptions: unknown[] | undefined,
  dependency_value: unknown
) {
  const [options, setOptions] = useState<unknown[]>(staticOptions || []);
  const [loading, setLoading] = useState<boolean>(false);

  const formdataRef = useRef(formdata);
  const fetchOptionRef = useRef(fetchOption);

  useEffect(() => {
    formdataRef.current = formdata;
    fetchOptionRef.current = fetchOption;
  }, [formdata, fetchOption]);

  useEffect(() => {
    let isMounted = true;
    const fetchOptions = async () => {
      if (field.type === "SELECT" || field.type === "SELECT_OBJECT") {
        const fetchFn = fetchOptionRef.current;
        if (fetchFn) {
          setLoading(true);
          try {
            let data: unknown[] = [];
            if (field.type === "SELECT") {
              const fn = fetchFn as () => Promise<string[]>;
              data = await fn();
            } else {
              const fn = fetchFn as (
                formdata: T,
              ) => Promise<Record<string, string | number | boolean>[]>;
              data = await fn(formdataRef.current);
            }
            if (isMounted) {
              setOptions(data || []);
            }
          } catch (e) {
            console.error("Error fetching options for field", field.key, e);
          } finally {
            if (isMounted) {
              setLoading(false);
            }
          }
        } else {
          setOptions(field.options || []);
        }
      }
    };

    fetchOptions();

    return () => {
      isMounted = false;
    };
  }, [field, staticOptions, dependency_value]);

  return { options, loading };
}

interface FieldSubComponentProps {
  disabled: boolean;
  handleInputChange: (val: unknown) => void;
  rules: Rule[];
}

interface InputFieldProps<T> extends FieldSubComponentProps {
  field: INPUT_PROPS<T>;
}

const InputField = <T,>({
  field,
  disabled,
  handleInputChange,
  rules,
}: InputFieldProps<T>) => {
  if (field.input_type === "password") {
    return (
      <Form.Item
        name={String(field.key)}
        label={field.label}
        key={String(field.key)}
        rules={rules}
      >
        <Input.Password
          className="w-full h-10 px-3 rounded-lg"
          placeholder={field.placeholder}
          disabled={disabled || field.disable}
          iconRender={(visible) => (visible ? <Eye /> : <EyeOff />)}
          onChange={(e) => {
            handleInputChange(e.target.value);
            if (field.onChange) {
              field.onChange(e.target.value);
            }
          }}
        />
      </Form.Item>
    );
  }

  return (
    <Form.Item
      name={String(field.key)}
      label={field.label}
      key={String(field.key)}
      rules={rules}
    >
      <Input
        type={
          field.input_type === "number"
            ? "number"
            : field.input_type === "email"
              ? "email"
              : "text"
        }
        className="w-full h-10 px-3 rounded-lg"
        placeholder={field.placeholder}
        disabled={disabled || field.disable}
        onChange={(e) => {
          handleInputChange(e.target.value);
          if (field.onChange) {
            field.onChange(e.target.value);
          }
        }}
      />
    </Form.Item>
  );
};

interface SelectFieldProps<T> extends FieldSubComponentProps {
  field: SELECT_PROPS<T>;
  options: unknown[];
  loading: boolean;
}

const SelectField = <T,>({
  field,
  disabled,
  handleInputChange,
  rules,
  options,
  loading,
}: SelectFieldProps<T>) => {
  return (
    <Form.Item
      name={String(field.key)}
      label={field.label}
      key={String(field.key)}
      rules={rules}
    >
      <Select
        disabled={disabled || field.disable || loading}
        notFoundContent={"No results found"}
        loading={loading}
        options={(options || []).map((item) => ({
          label: item as string,
          value: item as string,
        }))}
        onChange={(val) => {
          handleInputChange(val);
          if (field.onChange) {
            field.onChange(val);
          }
        }}
      />
    </Form.Item>
  );
};

interface SelectObjectFieldProps<T> extends FieldSubComponentProps {
  field: SELECT_OBJECT_PROPS<T>;
  options: unknown[];
  loading: boolean;
}

const SelectObjectField = <T,>({
  field,
  disabled,
  handleInputChange,
  rules,
  options,
  loading,
}: SelectObjectFieldProps<T>) => {
  return (
    <Form.Item
      name={String(field.key)}
      label={field.label}
      key={String(field.key)}
      rules={rules}
      getValueProps={(val) => ({
        value: val && typeof val === "object" ? val[field.value_key] : val,
      })}
    >
      <Select
        className="w-full h-10 rounded-lg text-left"
        popupClassName="rounded-lg border border-[var(--color-border-custom)] shadow-lg"
        placeholder={field.placeholder}
        disabled={disabled || field.disable || loading}
        loading={loading}
        notFoundContent={loading ? "Loading..." : "No results found"}
        options={(options || []).map((item) => {
          const record = item as Record<string, string | number | boolean>;
          return {
            label: String(record[field.display_key]),
            value: record[field.value_key] as string | number,
          };
        })}
        onChange={(val) => {
          const data = options.find((item) => {
            const record = item as Record<
              string,
              string | number | boolean
            >;
            return record[field.value_key] === val;
          });
          handleInputChange(data);
          if (field.onChange) {
            field.onChange(
              data as Record<string, string | number | boolean>,
            );
          }
        }}
      />
    </Form.Item>
  );
};

interface RadioFieldProps<T> extends FieldSubComponentProps {
  field: RADIO_PROPS<T>;
}

const RadioField = <T,>({
  field,
  disabled,
  handleInputChange,
  rules,
}: RadioFieldProps<T>) => {
  return (
    <Form.Item
      name={String(field.key)}
      label={field.label}
      key={String(field.key)}
      rules={rules}
    >
      <Radio.Group
        disabled={disabled || field.disable}
        onChange={(e) => {
          const val = e.target.value;
          handleInputChange(val);
          if (field.onChange) {
            field.onChange(val);
          }
        }}
        options={field.options}
      />
    </Form.Item>
  );
};

interface CheckboxFieldProps<T> extends FieldSubComponentProps {
  field: CHECKBOX_PROPS<T>;
}

const CheckboxField = <T,>({
  field,
  disabled,
  handleInputChange,
  rules,
}: CheckboxFieldProps<T>) => {
  return (
    <Form.Item
      name={String(field.key)}
      label={field.label}
      key={String(field.key)}
      rules={rules}
    >
      <Checkbox.Group
        disabled={disabled || field.disable}
        onChange={(checkedValues) => {
          handleInputChange(checkedValues);
          if (field.onChange) {
            field.onChange(checkedValues as string[]);
          }
        }}
        options={field.options}
      />
    </Form.Item>
  );
};

interface SwitchFieldProps<T> extends FieldSubComponentProps {
  field: SWITCH_PROPS<T>;
}

const SwitchField = <T,>({
  field,
  disabled,
  handleInputChange,
  rules,
}: SwitchFieldProps<T>) => {
  return (
    <Form.Item
      name={String(field.key)}
      label={field.label}
      key={String(field.key)}
      valuePropName="checked"
      rules={rules}
    >
      <Switch
        disabled={disabled || field.disable}
        checkedChildren={field.checkedChildren}
        unCheckedChildren={field.unCheckedChildren}
        onChange={(checked) => {
          handleInputChange(checked);
          if (field.onChange) {
            field.onChange(checked);
          }
        }}
      />
    </Form.Item>
  );
};

interface ButtonFieldProps<T> {
  field: BUTTON_PROPS<T>;
  disabled: boolean;
}

const ButtonField = <T,>({
  field,
  disabled,
}: ButtonFieldProps<T>) => {
  return (
    <Form.Item label={field.label} key={String(field.key)}>
      <Button
        type={field.buttonType || "default"}
        danger={field.danger}
        disabled={disabled || field.disable}
        onClick={field.onClick}
      >
        {field.buttonText}
      </Button>
    </Form.Item>
  );
};

const RenderFieldItem = <T,>({
  field,
  formdata,
  handleInputChange,
  disabled,
}: RenderFieldItemProps<T>) => {
  const staticOptions =
    field.type === "SELECT" || field.type === "SELECT_OBJECT"
      ? field.options
      : undefined;

  const fetchOption =
    field.type === "SELECT" || field.type === "SELECT_OBJECT"
      ? field.fetchOption
      : undefined;

  const dependency_value = field.dependency_field
    ? formdata[field.dependency_field as keyof T]
    : undefined;

  const { options, loading } = useFieldOptions(
    field,
    formdata,
    fetchOption,
    staticOptions,
    dependency_value
  );

  const isFirstRender = useRef(true);
  const handleInputChangeRef = useRef(handleInputChange);

  useEffect(() => {
    handleInputChangeRef.current = handleInputChange;
  }, [handleInputChange]);

  // Effect to reset the value when the dependency value changes after mount
  useEffect(() => {
    if (field.dependency_field) {
      if (isFirstRender.current) {
        isFirstRender.current = false;
        return;
      }
      handleInputChangeRef.current(undefined);
    }
  }, [dependency_value, field.dependency_field]);

  const rules = getFormItemRules(field);

  switch (field.type) {
    case "INPUT":
      return (
        <InputField
          field={field}
          disabled={disabled}
          handleInputChange={handleInputChange}
          rules={rules}
        />
      );
    case "SELECT":
      return (
        <SelectField
          field={field}
          disabled={disabled}
          handleInputChange={handleInputChange}
          rules={rules}
          options={options}
          loading={loading}
        />
      );
    case "SELECT_OBJECT":
      return (
        <SelectObjectField
          field={field}
          disabled={disabled}
          handleInputChange={handleInputChange}
          rules={rules}
          options={options}
          loading={loading}
        />
      );
    case "RADIO":
      return (
        <RadioField
          field={field}
          disabled={disabled}
          handleInputChange={handleInputChange}
          rules={rules}
        />
      );
    case "CHECKBOX":
      return (
        <CheckboxField
          field={field}
          disabled={disabled}
          handleInputChange={handleInputChange}
          rules={rules}
        />
      );
    case "SWITCH":
      return (
        <SwitchField
          field={field}
          disabled={disabled}
          handleInputChange={handleInputChange}
          rules={rules}
        />
      );
    case "BUTTON":
      return <ButtonField field={field} disabled={disabled} />;
    default:
      return null;
  }
};

const FieldRenderer = <T,>({
  fieldInfo,
  formdata,
  setFormdata,
  disabled = false,
}: FieldRendererProps<T>) => {
  const { isDark } = useTheme();
  const handleInputChange = (key: keyof T, val: unknown) => {
    console.log("handleInputChange", key, val);
    setFormdata((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Input: {
            colorBgContainer: isDark
              ? "rgba(9, 13, 22, 0.6)"
              : "rgba(255, 255, 255, 0.95)",
            colorBorder: isDark
              ? "rgba(255, 255, 255, 0.08)"
              : "rgba(15, 23, 42, 0.08)",
            hoverBorderColor: "rgba(124, 58, 237, 0.6)",
            activeBorderColor: "#7c3aed",
            activeShadow: "0 0 0 2px rgba(124, 58, 237, 0.2)",
            colorText: isDark ? "#f8fafc" : "#0f172a",
            colorTextPlaceholder: "rgba(156, 163, 175, 0.6)",
          },
          Select: {
            colorBgContainer: isDark
              ? "rgba(9, 13, 22, 0.6)"
              : "rgba(255, 255, 255, 0.95)",
            colorBorder: isDark
              ? "rgba(255, 255, 255, 0.08)"
              : "rgba(15, 23, 42, 0.08)",
            colorText: isDark ? "#f8fafc" : "#0f172a",
            optionSelectedBg: "rgba(124, 58, 237, 0.15)",
          },
          Radio: {
            colorPrimary: "#7c3aed",
            colorText: isDark ? "#f8fafc" : "#0f172a",
          },
          Checkbox: {
            colorPrimary: "#7c3aed",
            colorText: isDark ? "#f8fafc" : "#0f172a",
          },
          Switch: {
            colorPrimary: "#7c3aed",
          },
        },
      }}
    >
      <div className="flex flex-col gap-5">
        {fieldInfo.map((field) => (
          <RenderFieldItem
            key={String(field.key)}
            field={field}
            formdata={formdata}
            handleInputChange={(value) => handleInputChange(field.key, value)}
            disabled={disabled}
          />
        ))}
      </div>
    </ConfigProvider>
  );
};

export default FieldRenderer;
