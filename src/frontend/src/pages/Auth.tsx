import { Eye, EyeOff, MessageCircle } from "lucide-react";
import { useState } from "react";
import { navigate } from "../App";
import { useAuth } from "../context/AuthContext";

const goldText = { color: "#D4AF37" };
const goldMuted = { color: "rgba(212,175,55,0.6)" };
const inputStyle: React.CSSProperties = {
  background: "rgba(212,175,55,0.05)",
  border: "1px solid rgba(212,175,55,0.3)",
  color: "#D4AF37",
  fontFamily: "Montserrat, sans-serif",
  borderRadius: 8,
  padding: "12px 16px",
  width: "100%",
  outline: "none",
  fontSize: 14,
};

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="text-xs mt-1" style={{ color: "#ef4444" }}>
      {msg}
    </p>
  );
}

function InputField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  icon,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
  icon?: React.ReactNode;
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const inputId = label.toLowerCase().replace(/[^a-z0-9]/g, "-");
  return (
    <div className="mb-4">
      <label
        htmlFor={inputId}
        className="block text-xs tracking-widest mb-1 font-semibold"
        style={goldMuted}
      >
        {label}
      </label>
      <div className="relative flex items-center">
        {icon && (
          <span className="absolute left-3" style={goldText}>
            {icon}
          </span>
        )}
        <input
          id={inputId}
          type={isPassword ? (show ? "text" : "password") : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ ...inputStyle, paddingLeft: icon ? 40 : 16 }}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-3"
            style={goldMuted}
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      <FieldError msg={error} />
    </div>
  );
}

export default function Auth() {
  const { login, signup } = useAuth();
  const [tab, setTab] = useState<"login" | "signup">("login");

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Signup state
  const [signupData, setSignupData] = useState({
    name: "",
    contactNumber: "",
    address: "",
    whatsappNumber: "",
    email: "",
    password: "",
  });
  const [signupErrors, setSignupErrors] = useState<Record<string, string>>({});
  const [signupGlobalError, setSignupGlobalError] = useState("");

  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const validatePhone = (p: string) => /^\+?[0-9]{10,15}$/.test(p);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    if (!loginEmail || !loginPassword) {
      setLoginError("Email and password are required.");
      return;
    }
    const result = login(loginEmail, loginPassword);
    if (!result.success) {
      setLoginError(result.error || "Login failed.");
    } else {
      const users = JSON.parse(localStorage.getItem("me_users") || "[]");
      users.push({
        name: signupData.name,
        email: signupData.email,
        contactNumber: signupData.contactNumber,
        whatsappNumber: signupData.whatsappNumber,
        registeredAt: Date.now(),
      });
      localStorage.setItem("me_users", JSON.stringify(users));
      navigate("");
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupGlobalError("");
    const errs: Record<string, string> = {};
    if (!signupData.name.trim()) errs.name = "Name is required.";
    if (!signupData.contactNumber.trim())
      errs.contactNumber = "Contact number is required.";
    else if (!validatePhone(signupData.contactNumber))
      errs.contactNumber = "Enter a valid phone number (10-15 digits).";
    if (!signupData.address.trim()) errs.address = "Address is required.";
    if (!signupData.whatsappNumber.trim())
      errs.whatsappNumber = "WhatsApp number is required.";
    else if (!validatePhone(signupData.whatsappNumber))
      errs.whatsappNumber = "Enter a valid WhatsApp number (10-15 digits).";
    if (!signupData.email.trim()) errs.email = "Email is required.";
    else if (!validateEmail(signupData.email))
      errs.email = "Enter a valid email address.";
    if (!signupData.password) errs.password = "Password is required.";
    else if (signupData.password.length < 6)
      errs.password = "Password must be at least 6 characters.";
    setSignupErrors(errs);
    if (Object.keys(errs).length > 0) return;
    const result = signup(signupData);
    if (!result.success) {
      setSignupGlobalError(result.error || "Signup failed.");
    } else {
      navigate("");
    }
  };

  const setField = (key: string, val: string) => {
    setSignupData((prev) => ({ ...prev, [key]: val }));
    setSignupErrors((prev) => ({ ...prev, [key]: "" }));
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: "#000" }}
    >
      <div className="w-full max-w-md">
        <div
          className="p-8 rounded-2xl"
          style={{
            background: "rgba(0,0,0,0.8)",
            border: "1px solid rgba(212,175,55,0.35)",
            backdropFilter: "blur(16px)",
          }}
        >
          <div className="text-center mb-8">
            <h1
              className="text-3xl font-black tracking-widest mb-1"
              style={{ color: "#D4AF37", fontFamily: "Montserrat, sans-serif" }}
            >
              MEET ENTERPRISE
            </h1>
            <p className="text-xs tracking-[0.4em]" style={goldMuted}>
              LUXURY FASHION
            </p>
          </div>

          {/* Tabs */}
          <div
            className="flex rounded-lg overflow-hidden mb-8"
            style={{ border: "1px solid rgba(212,175,55,0.25)" }}
          >
            <button
              type="button"
              data-ocid="auth.login.tab"
              onClick={() => setTab("login")}
              className="flex-1 py-3 text-sm font-bold tracking-widest transition-all"
              style={{
                background: tab === "login" ? "#D4AF37" : "transparent",
                color: tab === "login" ? "#000" : "#D4AF37",
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              LOGIN
            </button>
            <button
              type="button"
              data-ocid="auth.signup.tab"
              onClick={() => setTab("signup")}
              className="flex-1 py-3 text-sm font-bold tracking-widest transition-all"
              style={{
                background: tab === "signup" ? "#D4AF37" : "transparent",
                color: tab === "signup" ? "#000" : "#D4AF37",
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              SIGN UP
            </button>
          </div>

          {tab === "login" && (
            <form onSubmit={handleLogin} noValidate>
              <InputField
                label="EMAIL"
                type="email"
                value={loginEmail}
                onChange={setLoginEmail}
                placeholder="your@email.com"
              />
              <InputField
                label="PASSWORD"
                type="password"
                value={loginPassword}
                onChange={setLoginPassword}
                placeholder="••••••••"
              />
              {loginError && (
                <div
                  data-ocid="auth.error_state"
                  className="mb-4 p-3 rounded-lg text-xs"
                  style={{
                    background: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.3)",
                    color: "#ef4444",
                  }}
                >
                  {loginError}
                </div>
              )}
              <button
                type="submit"
                data-ocid="auth.login.submit_button"
                className="w-full py-4 text-sm tracking-widest font-black mt-2"
                style={{
                  background: "#D4AF37",
                  color: "#000",
                  borderRadius: 8,
                  fontFamily: "Montserrat, sans-serif",
                  cursor: "pointer",
                  border: "none",
                }}
              >
                LOGIN
              </button>
              <button
                type="button"
                data-ocid="auth.guest.button"
                onClick={() => navigate("")}
                className="w-full mt-3 text-xs tracking-wider hover:opacity-80"
                style={{
                  ...goldMuted,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Continue as Guest
              </button>
            </form>
          )}

          {tab === "signup" && (
            <form onSubmit={handleSignup} noValidate>
              <InputField
                label="FULL NAME"
                value={signupData.name}
                onChange={(v) => setField("name", v)}
                placeholder="Your full name"
                error={signupErrors.name}
              />
              <InputField
                label="CONTACT NUMBER"
                type="tel"
                value={signupData.contactNumber}
                onChange={(v) => setField("contactNumber", v)}
                placeholder="+91XXXXXXXXXX"
                error={signupErrors.contactNumber}
              />
              <InputField
                label="ADDRESS"
                value={signupData.address}
                onChange={(v) => setField("address", v)}
                placeholder="Your full address"
                error={signupErrors.address}
              />
              <InputField
                label="WHATSAPP NUMBER"
                type="tel"
                value={signupData.whatsappNumber}
                onChange={(v) => setField("whatsappNumber", v)}
                placeholder="+91XXXXXXXXXX"
                error={signupErrors.whatsappNumber}
                icon={<MessageCircle size={16} />}
              />
              <InputField
                label="EMAIL"
                type="email"
                value={signupData.email}
                onChange={(v) => setField("email", v)}
                placeholder="your@email.com"
                error={signupErrors.email}
              />
              <InputField
                label="PASSWORD"
                type="password"
                value={signupData.password}
                onChange={(v) => setField("password", v)}
                placeholder="Min. 6 characters"
                error={signupErrors.password}
              />
              {signupGlobalError && (
                <div
                  data-ocid="auth.error_state"
                  className="mb-4 p-3 rounded-lg text-xs"
                  style={{
                    background: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.3)",
                    color: "#ef4444",
                  }}
                >
                  {signupGlobalError}
                </div>
              )}
              <button
                type="submit"
                data-ocid="auth.signup.submit_button"
                className="w-full py-4 text-sm tracking-widest font-black mt-2"
                style={{
                  background: "#D4AF37",
                  color: "#000",
                  borderRadius: 8,
                  fontFamily: "Montserrat, sans-serif",
                  cursor: "pointer",
                  border: "none",
                }}
              >
                CREATE ACCOUNT
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
