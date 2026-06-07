import React from "react";
import { Modal, ConfigProvider, theme as antTheme } from "antd";
import { Trash2 } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

type DeleteModalProps = {
  visible: boolean;
  onClose: () => void;
  onDelete: () => void;
  title?: string;
  description?: string;
  itemName?: string;
  confirmLoading?: boolean;
};

const DeleteModal: React.FC<DeleteModalProps> = ({
  visible,
  onClose,
  onDelete,
  title,
  description,
  itemName,
  confirmLoading = false,
}) => {
  const { isDark } = useTheme();

  const blurStyle = {
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    background: isDark ? "rgba(0, 0, 0, 0.65)" : "rgba(0, 0, 0, 0.35)",
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
        token: {
          colorPrimary: "#ef4444", // Red brand color for delete
          fontFamily: "Outfit, sans-serif",
        },
      }}
    >
      <Modal
        open={visible}
        onCancel={confirmLoading ? undefined : onClose}
        footer={null}
        title={null}
        closeIcon={null}
        width={420}
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
        <div
          className="relative flex flex-col items-center text-center transition-all duration-300"
          style={{
            background: isDark
              ? "rgba(13, 21, 37, 0.9)"
              : "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          {/* Visual Warning/Trash Icon Indicator */}
          <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 mb-4 animate-pulse-subtle">
            <div className="absolute inset-0 rounded-full bg-red-500/5 animate-ping opacity-75" />
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/20 text-red-500">
              <Trash2 className="w-6 h-6" />
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold tracking-tight text-text-base font-outfit mb-2">
            {title || "Confirm Delete"}
          </h3>

          {/* Description / Highlight Area */}
          <div className="text-xs text-text-muted opacity-90 leading-relaxed font-outfit mb-6 px-2">
            {itemName ? (
              <p>
                {description || "Are you sure you want to permanently delete"}{" "}
                <span className="font-semibold px-2 py-0.5 mx-0.5 rounded-md bg-red-500/10 border border-red-500/20 text-red-500 text-[11px] inline-block font-mono">
                  {itemName}
                </span>
                ? This action is irreversible and all associated data will be
                removed.
              </p>
            ) : (
              <p>
                {description ||
                  "Are you sure you want to delete this item? This action is irreversible."}
              </p>
            )}
          </div>

          {/* Actions Footer */}
          <div className="flex items-center justify-center gap-3 w-full">
            <button
              type="button"
              disabled={confirmLoading}
              onClick={onClose}
              className={`flex-1 px-4 py-2.5 text-xs font-semibold rounded-xl border border-border-custom bg-bg-card/40 text-text-muted hover:text-text-base hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] ${
                confirmLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={confirmLoading}
              onClick={onDelete}
              className={`flex-1 px-4 py-2.5 text-xs font-semibold text-white rounded-xl shadow-md bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] ${
                confirmLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {confirmLoading && (
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
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </ConfigProvider>
  );
};

export default DeleteModal;
