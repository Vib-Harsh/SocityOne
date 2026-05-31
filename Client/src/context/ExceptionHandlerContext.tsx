/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  type ReactNode,
} from "react";
import { message, Modal, Input, Button, Typography, Space } from "antd";
import { AlertTriangle, RotateCw, Send } from "lucide-react";
import { clientLogger } from "../utils/logger";
import { useTheme } from "./ThemeContext";

const { Text, Paragraph, Title } = Typography;
const { TextArea } = Input;

interface ExceptionHandlerContextType {
  handleException: (
    error: Error,
    priority?: "high" | "normal",
    source?: string,
  ) => void;
}

const ExceptionHandlerContext = createContext<
  ExceptionHandlerContextType | undefined
>(undefined);

// Static/global reference to exception handler for non-React files (e.g. Axios interceptors)
let globalExceptionHandler:
  | ((error: Error, priority?: "high" | "normal", source?: string) => void)
  | null = null;

export const triggerGlobalException = (
  error: Error,
  priority: "high" | "normal" = "normal",
  source = "API Service",
) => {
  if (globalExceptionHandler) {
    globalExceptionHandler(error, priority, source);
  } else {
    console.error(`[Pre-init Global Error in ${source}]:`, error);
  }
};

// -------------------------------------------------------------
// React ErrorBoundary Class Component
// -------------------------------------------------------------
interface ErrorBoundaryProps {
  children: ReactNode;
  onError: (error: Error, priority: "high" | "normal", source: string) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class AppErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  public override state: ErrorBoundaryState = { hasError: false };

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  public override componentDidCatch(error: Error, _errorInfo: React.ErrorInfo) {
    this.props.onError(error, "high", "Render Boundary");
  }

  public override render() {
    if (this.state.hasError) {
      // Render null when crashed, as the global reporting modal will handle the visual overlay.
      return null;
    }
    return this.props.children;
  }
}

// -------------------------------------------------------------
// Context Provider Component
// -------------------------------------------------------------
export const ExceptionHandlerProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { isDark } = useTheme();

  // State for high-priority Modal trigger
  const [errorModalInfo, setErrorModalInfo] = useState<{
    error: Error;
    source: string;
  } | null>(null);

  const [userMessage, setUserMessage] = useState("");
  const [reporting, setReporting] = useState(false);
  const recentErrors = useRef<Map<string, number>>(new Map());

  /**
   * Main Exception handler.
   * - Saves all logs in localStorage (verified if logged-in).
   * - Triggers modal for high priority.
   * - Triggers Ant Design message toaster for normal priority.
   */
  const handleException = (
    error: Error,
    priority: "high" | "normal" = "normal",
    source = "Application",
  ) => {
    const errorMsg = error.message || "An unexpected error occurred.";

    // Save error in local log storage
    clientLogger.logError(error, `[${source}] ${errorMsg}`);

    // Prevent toaster spam for identical errors in normal flow
    const now = Date.now();
    const lastSeen = recentErrors.current.get(errorMsg);
    if (priority === "normal" && lastSeen && now - lastSeen < 2000) {
      return;
    }
    recentErrors.current.set(errorMsg, now);

    if (priority === "high") {
      setErrorModalInfo({ error, source });
    } else {
      // Normal Priority: Show Ant Design error toaster
      message.error({
        content: `${errorMsg}`,
        duration: 4.5,
        style: { marginTop: "10vh" },
      });
    }
  };

  // Listen for global runtime exceptions and unhandled promise rejections
  useEffect(() => {
    globalExceptionHandler = handleException;

    const handleGlobalError = (event: ErrorEvent) => {
      const error =
        event.error || new Error(event.message || "Script execution error");
      handleException(error, "normal", "Runtime Error");
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const error =
        reason instanceof Error
          ? reason
          : new Error(String(reason || "Unhandled Promise Rejection"));
      handleException(error, "normal", "Promise Rejection");
    };

    window.addEventListener("error", handleGlobalError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      globalExceptionHandler = null;
      window.removeEventListener("error", handleGlobalError);
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection,
      );
    };
  }, []);

  const handleReload = () => {
    window.location.reload();
  };

  const handleReportAndReload = async () => {
    if (!errorModalInfo) return;

    setReporting(true);
    try {
      // Prepare report payload
      const payload = clientLogger.prepareReportPayload(userMessage);

      // Print consolidated report payload in console for developer transparency
      console.log("Preparing critical error report payload:", payload);

      // TODO: Send critical report payload to server API
      // When the backend API is created, make a POST call here:
      // await service.post("/administration/logs/report", payload);

      // Minor simulated delay to improve user reporting feel
      await new Promise((resolve) => setTimeout(resolve, 800));
    } catch (e) {
      console.warn("Failed to complete issue reporting sequence:", e);
    } finally {
      setReporting(false);
      window.location.reload(); // Perform hard reload
    }
  };

  return (
    <ExceptionHandlerContext.Provider value={{ handleException }}>
      <AppErrorBoundary
        onError={(err, pri, src) => handleException(err, pri, src)}
      >
        {children}
      </AppErrorBoundary>

      {/* Critical Crash / High-Priority Error Modal */}
      <Modal
        open={errorModalInfo !== null}
        title={null}
        footer={null}
        closable={false}
        centered
        width={520}
        styles={{
          mask: {
            backdropFilter: "blur(6px)",
            backgroundColor: isDark
              ? "rgba(3, 7, 18, 0.65)"
              : "rgba(255, 255, 255, 0.5)",
          },
          body: {
            padding: 0,
            overflow: "hidden",
            borderRadius: "24px",
          },
        }}
        style={{
          padding: 0,
          borderRadius: "24px",
        }}
      >
        <div
          style={{
            padding: "32px",
            borderRadius: "24px",
            border: isDark
              ? "1px solid rgba(255, 255, 255, 0.08)"
              : "1px solid rgba(15, 23, 42, 0.08)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            background: isDark
              ? "linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(9, 13, 22, 0.98) 100%)"
              : "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.98) 100%)",
            color: isDark ? "#f8fafc" : "#0f172a",
          }}
        >
          <Space direction="vertical" size={24} style={{ width: "100%" }}>
            {/* Animated/Glowing Error Header */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div
                style={{
                  background: "rgba(239, 68, 68, 0.15)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  padding: "12px",
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 15px rgba(239, 68, 68, 0.1)",
                }}
              >
                <AlertTriangle size={28} className="text-red-500" />
              </div>
              <div>
                <Title
                  level={4}
                  style={{
                    margin: 0,
                    fontWeight: 800,
                    letterSpacing: "-0.025em",
                    color: isDark ? "#f8fafc" : "#0f172a",
                  }}
                >
                  Critical Error Occurred
                </Title>
                <Text type="secondary" style={{ fontSize: "13px" }}>
                  Source: {errorModalInfo?.source || "Application Root"}
                </Text>
              </div>
            </div>

            {/* Sorry Message */}
            <Paragraph
              style={{
                margin: 0,
                fontSize: "14.5px",
                lineHeight: "1.6",
                color: isDark ? "#cbd5e1" : "#475569",
              }}
            >
              We are deeply sorry, but **SocietyOne** encountered a major
              application failure. To prevent further data inconsistencies,
              please reload the page.
            </Paragraph>

            {/* Error Details Accordion/Card */}
            <div
              style={{
                padding: "16px",
                borderRadius: "16px",
                background: isDark
                  ? "rgba(9, 13, 22, 0.5)"
                  : "rgba(241, 245, 249, 0.7)",
                border: isDark
                  ? "1px solid rgba(255, 255, 255, 0.05)"
                  : "1px solid rgba(15, 23, 42, 0.05)",
              }}
            >
              <Paragraph
                ellipsis={{ rows: 2, expandable: true, symbol: "Expand" }}
                style={{
                  margin: 0,
                  fontFamily: "monospace",
                  fontSize: "12px",
                  color: isDark ? "#ef4444" : "#dc2626",
                }}
              >
                {errorModalInfo?.error?.message ||
                  "Unknown execution crash details"}
              </Paragraph>
            </div>

            {/* Custom Message input from user */}
            <Space direction="vertical" size={8} style={{ width: "100%" }}>
              <Text
                strong
                style={{
                  fontSize: "13.5px",
                  color: isDark ? "#94a3b8" : "#475569",
                }}
              >
                What were you doing when this happened? (Optional)
              </Text>
              <TextArea
                rows={3}
                placeholder="e.g. I was trying to log in as Super Admin..."
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                disabled={reporting}
                style={{
                  borderRadius: "12px",
                  padding: "10px 14px",
                  border: isDark
                    ? "1px solid rgba(255, 255, 255, 0.1)"
                    : "1px solid rgba(15, 23, 42, 0.15)",
                  background: isDark
                    ? "rgba(17, 24, 39, 0.4)"
                    : "rgba(255, 255, 255, 0.95)",
                  color: isDark ? "#f8fafc" : "#0f172a",
                }}
              />
            </Space>

            {/* Modal Action Buttons */}
            <Space
              size={12}
              style={{ width: "100%", justifyContent: "flex-end" }}
            >
              <Button
                size="large"
                icon={<RotateCw size={16} />}
                onClick={handleReload}
                disabled={reporting}
                style={{
                  borderRadius: "12px",
                  fontWeight: 600,
                  border: isDark
                    ? "1px solid rgba(255, 255, 255, 0.15)"
                    : "1px solid rgba(15, 23, 42, 0.15)",
                  color: isDark ? "#cbd5e1" : "#475569",
                  background: "transparent",
                }}
              >
                Reload
              </Button>
              <Button
                type="primary"
                size="large"
                icon={<Send size={16} />}
                loading={reporting}
                onClick={handleReportAndReload}
                style={{
                  borderRadius: "12px",
                  fontWeight: 600,
                  border: "none",
                  background:
                    "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
                  boxShadow: "0 4px 12px rgba(124, 58, 237, 0.35)",
                }}
              >
                Report and Reload
              </Button>
            </Space>
          </Space>
        </div>
      </Modal>
    </ExceptionHandlerContext.Provider>
  );
};

export const useExceptionHandler = () => {
  const context = useContext(ExceptionHandlerContext);
  if (context === undefined) {
    throw new Error(
      "useExceptionHandler must be used within an ExceptionHandlerProvider",
    );
  }
  return context;
};
