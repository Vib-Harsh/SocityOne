import React from "react";
import { Modal, Drawer, ConfigProvider, theme as antTheme, Form } from "antd";
import { X } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import type { FormRendererProps } from "@/types/formRenderer";

const FormRenderer: React.FC<FormRendererProps> = ({
  visible,
  renderItem,
  onClose,
  headerProperties,
  footerProperties,
  width,
  backdropBlur = true,
  children,
  className = "",
  form,
}) => {
  const { isDark } = useTheme();
  const {
    title,
    description,
    showClose = true,
    extraHeaderActions,
  } = headerProperties || {};

  const {
    showCancel = true,
    cancelText = "Cancel",
    onCancel,
    showSubmit = true,
    submitText = "Submit",
    onSubmit,
    submitLoading = false,
    submitDisabled = false,
    cancelDisabled = false,
    cancelLoading = false,
    extraActions,
  } = footerProperties || {};

  const handleCancel = onCancel || onClose;

  const [localForm] = Form.useForm();
  const activeForm = form || localForm;

  React.useEffect(() => {
    if (!visible) {
      activeForm.resetFields();
    }
  }, [visible, activeForm]);

  const renderContent = () => (
    <Form
      form={activeForm}
      layout="vertical"
      onFinish={onSubmit}
      className={`flex flex-col h-full overflow-hidden shadow-2xl transition-all duration-300 ${
        renderItem === "modal" ? "rounded-3xl border border-border-custom" : ""
      } ${className}`}
      style={{
        background: isDark
          ? "rgba(13, 21, 37, 0.85)"
          : "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      {/* Header Section */}
      {(title || description || showClose || extraHeaderActions) && (
        <div className="flex-shrink-0 flex items-start justify-between p-6 border-b border-border-custom/50 bg-black/[0.02] dark:bg-white/[0.01]">
          <div className="flex flex-col gap-1.5 flex-1 pr-4">
            {title && (
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold tracking-tight text-text-base font-outfit">
                  {title}
                </h3>
                {extraHeaderActions}
              </div>
            )}
            {description && (
              <p className="text-xs text-text-muted opacity-85 leading-normal font-outfit">
                {description}
              </p>
            )}
          </div>
          {showClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl border border-border-custom bg-bg-card/40 hover:bg-black/5 dark:hover:bg-white/5 text-text-muted hover:text-text-base cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Body Content Section */}
      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-border-custom scrollbar-track-transparent">
        {children}
      </div>

      {/* Footer Section */}
      {(showCancel || showSubmit || extraActions) && (
        <div className="flex-shrink-0 flex items-center justify-between gap-3 px-6 py-4 border-t border-border-custom/50 bg-black/[0.02] dark:bg-white/[0.01]">
          {/* Left aligned extra actions */}
          <div className="flex items-center gap-2">{extraActions}</div>

          {/* Right aligned standard buttons */}
          <div className="flex items-center gap-3">
            {showCancel && (
              <button
                type="button"
                disabled={cancelDisabled || cancelLoading}
                onClick={handleCancel}
                className={`px-4.5 py-2 text-xs font-semibold rounded-xl border border-border-custom bg-bg-card/40 text-text-muted hover:text-text-base hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] ${
                  cancelDisabled || cancelLoading
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {cancelLoading && (
                  <svg
                    className="animate-spin h-3.5 w-3.5 text-text-muted"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                )}
                {cancelText}
              </button>
            )}
            {showSubmit && (
              <button
                type="submit"
                disabled={submitDisabled || submitLoading}  
                className={`px-5 py-2 text-xs font-semibold text-white rounded-xl shadow-md bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] ${
                  submitDisabled || submitLoading
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {submitLoading && (
                  <svg
                    className="animate-spin h-3.5 w-3.5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                )}
                {submitText}
              </button>
            )}
          </div>
        </div>
      )}
    </Form>
  );

  const blurStyle = backdropBlur
    ? {
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        background: isDark ? "rgba(0, 0, 0, 0.6)" : "rgba(0, 0, 0, 0.3)",
      }
    : undefined;

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
        token: {
          colorPrimary: "#7c3aed",
          fontFamily: "Outfit, sans-serif",
        },
      }}
    >
      {renderItem === "modal" ? (
        <Modal
          open={visible}
          onCancel={onClose}
          footer={null}
          title={null}
          closeIcon={null}
          width={width ?? 600}
          centered
          styles={{
            body: {
              padding: 0,
              background: "transparent",
              overflow: "hidden",
            },
            mask: blurStyle,
          }}
        >
          {renderContent()}
        </Modal>
      ) : (
        <Drawer
          open={visible}
          onClose={onClose}
          footer={null}
          title={null}
          closeIcon={null}
          width={width ?? 450}
          placement="right"
          styles={{
            body: {
              padding: 0,
              overflow: "hidden",
            },
            mask: blurStyle,
          }}
        >
          {renderContent()}
        </Drawer>
      )}
    </ConfigProvider>
  );
};

export default FormRenderer;
