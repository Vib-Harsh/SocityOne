import React, { useState } from "react";
import { Form, Input, Button, ConfigProvider, theme as antTheme } from "antd";
import { Mail, Lock, ArrowRight, Eye, EyeOff, Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { loginSuper } from "@/services";
import type { superUserLogin } from "@/types";
import { useNavigate } from "react-router-dom";
import { url } from "@/constant";

const SuperAdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm<superUserLogin>();
  const [loading, setLoading] = useState(false);
  const [loginStatus, setLoginStatus] = useState<
    "idle" | "authenticating" | "success" | "error"
  >("idle");

  const { isDark, toggleTheme } = useTheme();

  const onFinish = async (values: superUserLogin) => {
    setLoading(true);
    setLoginStatus("authenticating");
    setTimeout(async () => {
      try {
        const res = await loginSuper(values);
        setLoginStatus("success");
        setLoading(false);
        localStorage.setItem("token", res.token);
        navigate(url.SUPERUSER.dashboard);
      } catch (_error) {
        setLoginStatus("error");
        setLoading(false);
      }
    }, 500);
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
        token: {
          colorPrimary: "#7c3aed",
          colorBgContainer: isDark
            ? "rgba(13, 21, 37, 0.45)"
            : "rgba(255, 255, 255, 0.8)",
          borderRadius: 12,
          fontFamily: "Outfit, sans-serif",
          colorBorder: isDark
            ? "rgba(255, 255, 255, 0.08)"
            : "rgba(15, 23, 42, 0.08)",
          colorTextBase: isDark ? "#f8fafc" : "#0f172a",
        },
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
          Button: {
            colorPrimary: "#7c3aed",
            colorPrimaryHover: "#8b5cf6",
            colorPrimaryActive: "#6d28d9",
            colorBgContainer: "rgba(124, 58, 237, 0.1)",
            defaultBorderColor: "rgba(124, 58, 237, 0.3)",
          },
          Checkbox: {
            colorPrimary: "#7c3aed",
            colorPrimaryHover: "#8b5cf6",
            colorText: isDark ? "#94a3b8" : "#475569",
          },
        },
      }}
    >
      <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center p-6 box-border transition-colors duration-500 bg-bg-base">
        {/* Animated Background Glow orbs */}
        <div className="ambient-glow glow-purple" />
        <div className="ambient-glow glow-teal" />
        <div className="ambient-glow glow-blue" />

        {/* Floating Theme Toggle Switch with beautiful animation */}
        <button
          onClick={toggleTheme}
          className="absolute top-6 right-6 z-50 p-3 rounded-full glass-panel bg-bg-card border border-border-custom text-text-base hover:text-primary transition-all duration-300 cursor-pointer shadow-md flex items-center justify-center hover:scale-105 active:scale-95"
          aria-label="Toggle Theme"
        >
          {isDark ? (
            <Sun size={20} className="text-yellow-400 animate-pulse" />
          ) : (
            <Moon size={20} className="text-violet-600" />
          )}
        </button>

        <div className="w-full max-w-[1100px] z-10 fade-in-up">
          <div className="glass-panel grid grid-cols-1 md:grid-cols-2 overflow-hidden bg-bg-card border border-border-custom rounded-3xl transition-all duration-400">
            {/* Left Side: Premium SVG Art & Gateway Info */}
            <div className="p-10 md:p-12 flex flex-col justify-center items-center text-center transition-all duration-300 bg-black/5 dark:bg-black/25 border-b md:border-b-0 md:border-r border-border-custom">
              <div className="relative mb-6">
                {/* Special Super Admin Digital Shield SVG */}
                <svg
                  width="180"
                  height="180"
                  viewBox="0 0 200 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="glow-svg-element"
                >
                  <defs>
                    <linearGradient
                      id="shieldGrad"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#7C3AED" />
                      <stop offset="100%" stopColor="#0D9488" />
                    </linearGradient>
                    <linearGradient
                      id="glowGrad"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#C084FC" />
                      <stop offset="100%" stopColor="#2563EB" />
                    </linearGradient>
                  </defs>

                  {/* Outer Circuit Dots & Lines */}
                  <circle cx="100" cy="20" r="4" fill="#0D9488" />
                  <path
                    d="M100 20 L100 40"
                    stroke="#0D9488"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                  />

                  <circle cx="20" cy="100" r="4" fill="#7C3AED" />
                  <path
                    d="M20 100 L40 100"
                    stroke="#7C3AED"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                  />

                  <circle cx="180" cy="100" r="4" fill="#2563EB" />
                  <path
                    d="M180 100 L160 100"
                    stroke="#2563EB"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                  />

                  {/* Rotating Outer Hexagon */}
                  <polygon
                    points="100,10 178,55 178,145 100,190 22,145 22,55"
                    stroke="url(#glowGrad)"
                    strokeWidth="1.5"
                    strokeOpacity="0.4"
                    fill="none"
                    style={{
                      transformOrigin: "center",
                      animation: "spin 25s linear infinite",
                    }}
                  />

                  {/* Animated Circuit Lines */}
                  <path
                    d="M 50 50 L 100 30 L 150 50 L 150 150 L 100 170 L 50 150 Z"
                    stroke="url(#shieldGrad)"
                    strokeWidth="2.5"
                    fill="none"
                    className="circuit-line"
                  />

                  {/* Glass-feel Solid Inner Shield */}
                  <path
                    d="M 60 60 L 100 42 L 140 60 L 140 140 L 100 158 L 60 140 Z"
                    fill="rgba(124, 58, 237, 0.06)"
                    stroke="url(#shieldGrad)"
                    strokeWidth="1.5"
                    strokeDasharray="180"
                  />

                  {/* Central Security Core: A digital padlock + Crown */}
                  {/* Crown representing 'Super' */}
                  <path
                    d="M 85 82 L 90 92 L 100 84 L 110 92 L 115 82 L 110 96 L 90 96 Z"
                    fill="url(#glowGrad)"
                  />

                  {/* Padlock Body */}
                  <rect
                    x="86"
                    y="105"
                    width="28"
                    height="22"
                    rx="4"
                    fill="url(#shieldGrad)"
                  />
                  {/* Padlock Shackle */}
                  <path
                    d="M 92 105 V 98 C 92 92, 108 92, 108 98 V 105"
                    stroke={isDark ? "#F3F4F6" : "#0F172A"}
                    strokeWidth="2"
                    fill="none"
                  />
                  {/* Keyhole */}
                  <circle
                    cx="100"
                    cy="113"
                    r="2.5"
                    fill={isDark ? "#090D16" : "#FFFFFF"}
                  />
                  <path
                    d="M 100 115 L 100 122"
                    stroke={isDark ? "#090D16" : "#FFFFFF"}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>

                <style
                  dangerouslySetInnerHTML={{
                    __html: `
                  @keyframes spin {
                    100% { transform: rotate(360deg); }
                  }
                `,
                  }}
                />
              </div>

              <h2 className="text-3xl font-extrabold mb-2 tracking-tight text-text-base">
                Society
                <span className="bg-gradient-to-r from-violet-500 to-teal-500 bg-clip-text text-transparent">
                  One
                </span>
              </h2>

              <div className="bg-primary/10 border border-primary/20 text-primary px-4 py-1.5 rounded-full flex items-center gap-2 mb-4 transition-all duration-300">
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                  Super Admin Terminal
                </span>
              </div>

              <p className="text-text-muted text-sm max-w-[320px] mb-8 leading-relaxed transition-all duration-300">
                Provide Credentials sequence to authenticate.
              </p>
            </div>

            {/* Right Side: Login Form with Interactive Console */}
            <div className="p-10 md:p-12 flex flex-col justify-center transition-all duration-300">
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-1.5 text-text-base transition-colors duration-300">
                  Secure Handshake
                </h3>
                <p className="text-text-muted text-sm transition-colors duration-300">
                  Provide credentials sequence to authenticate.
                </p>
              </div>

              <Form
                form={form}
                name="super_admin_login"
                layout="vertical"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                requiredMark={false}
              >
                {/* Email Field */}
                <Form.Item
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Please input admin security sequence email!",
                    },
                  ]}
                  className="mb-5"
                >
                  <Input
                    prefix={
                      <Mail
                        size={16}
                        className="text-text-muted mr-1.5 transition-colors"
                      />
                    }
                    placeholder="Enter Security Email"
                    size="large"
                    disabled={loading}
                    className="h-12 rounded-xl transition-all"
                  />
                </Form.Item>

                {/* Password Field */}
                <Form.Item
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Please input authorization password sequence!",
                    },
                  ]}
                  className="mb-5"
                >
                  <Input.Password
                    prefix={
                      <Lock
                        size={16}
                        className="text-text-muted mr-1.5 transition-colors"
                      />
                    }
                    iconRender={(visible) =>
                      visible ? <EyeOff size={16} /> : <Eye size={16} />
                    }
                    placeholder="Enter Clearance Code"
                    size="large"
                    disabled={loading}
                    className="h-12 rounded-xl transition-all"
                  />
                </Form.Item>
                {/* Submit Action */}
                <Form.Item className="mb-0">
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    size="large"
                    block
                    className="h-12 font-semibold text-sm flex items-center justify-center gap-2 rounded-xl border-none shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-300"
                    style={{
                      background:
                        loginStatus === "success"
                          ? "#10b981"
                          : "linear-gradient(135deg, #7c3aed 0%, #0d9488 100%)",
                    }}
                  >
                    {loginStatus === "authenticating" ? (
                      "Establishing Handshake..."
                    ) : loginStatus === "success" ? (
                      "Access Decrypted!"
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Authenticate Access <ArrowRight size={16} />
                      </span>
                    )}
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default SuperAdminLogin;
