import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { useAuthStore, useLanguageStore, useUIStore } from "@/stores";
import {
  User,
  Lock,
  Bell,
  Globe,
  Palette,
  Info,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  Camera,
  Shield,
  Eye,
  Volume2,
  Moon,
  Sun,
  X,
  Check,
  AlertCircle,
  EyeOff,
  Loader2,
} from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";

// ─── Profile Info Modal ────────────────────────────────────────────
function ProfileModal({
  isOpen,
  onClose,
  t,
}: {
  isOpen: boolean;
  onClose: () => void;
  t: (key: string, section?: string) => string;
}) {
  const { user, updateProfile } = useAuthStore();
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [location, setLocation] = useState(user?.location || "");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    if (isOpen && user) {
      setFullName(user.full_name || "");
      setBio(user.bio || "");
      setLocation(user.location || "");
      setStatus(null);
    }
  }, [isOpen, user]);

  const handleSave = async () => {
    if (!fullName.trim()) return;
    setIsLoading(true);
    setStatus(null);
    try {
      await updateProfile({
        full_name: fullName.trim(),
        bio: bio.trim() || null,
        location: location.trim() || null,
      });
      setStatus({ type: "success", message: t("profileUpdateSuccess", "settings") });
      setTimeout(() => onClose(), 1500);
    } catch {
      setStatus({ type: "error", message: t("profileUpdateError", "settings") });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-card rounded-2xl shadow-2xl border border-border w-full max-w-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-[#ff3131] to-[#ff914d] px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">{t("profileModalTitle", "settings")}</h2>
                <p className="text-white/80 text-sm mt-0.5">{t("profileModalSubtitle", "settings")}</p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <X size={18} className="text-white" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-5 space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                {t("fullNameLabel", "settings")} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={t("fullNamePlaceholder", "settings")}
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#ff3131]/50 focus:border-[#ff3131] transition-all text-sm"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                {t("bioLabel", "settings")}
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder={t("bioPlaceholder", "settings")}
                rows={3}
                maxLength={200}
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#ff3131]/50 focus:border-[#ff3131] transition-all resize-none text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1 text-right">{bio.length}/200</p>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                {t("locationLabel", "settings")}
              </label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder={t("locationPlaceholder", "settings")}
                  className="w-full pl-10 pr-4 py-2.5 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#ff3131]/50 focus:border-[#ff3131] transition-all text-sm"
                />
              </div>
            </div>

            {/* Status message */}
            <AnimatePresence>
              {status && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium ${
                    status.type === "success"
                      ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                      : "bg-red-500/10 text-red-600 border border-red-500/20"
                  }`}
                >
                  {status.type === "success" ? <Check size={16} /> : <AlertCircle size={16} />}
                  {status.message}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl border border-border text-foreground hover:bg-muted transition-colors text-sm font-medium disabled:opacity-50"
            >
              {t("cancelBtn", "settings")}
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading || !fullName.trim()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white font-medium hover:shadow-lg hover:shadow-[#ff3131]/25 transition-all text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading && <Loader2 size={16} className="animate-spin" />}
              {isLoading ? t("saving", "settings") : t("saveBtn", "settings")}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Contact Info Modal ────────────────────────────────────────────
function ContactModal({
  isOpen,
  onClose,
  t,
}: {
  isOpen: boolean;
  onClose: () => void;
  t: (key: string, section?: string) => string;
}) {
  const { user, updateEmail, updatePhone } = useAuthStore();
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [emailLoading, setEmailLoading] = useState(false);
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Track original values to detect changes
  const [originalEmail, setOriginalEmail] = useState(user?.email || "");
  const [originalPhone, setOriginalPhone] = useState(user?.phone || "");

  useEffect(() => {
    if (isOpen && user) {
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setOriginalEmail(user.email || "");
      setOriginalPhone(user.phone || "");
      setStatus(null);
    }
  }, [isOpen, user]);

  const emailChanged = email.trim() !== originalEmail;
  const phoneChanged = phone.trim() !== originalPhone;

  const handleSave = async () => {
    setStatus(null);

    try {
      // Update email if changed
      if (emailChanged && email.trim()) {
        setEmailLoading(true);
        await updateEmail(email.trim());
        setOriginalEmail(email.trim());
        setStatus({ type: "success", message: t("emailUpdateSuccess", "settings") });
        setEmailLoading(false);
      }

      // Update phone if changed
      if (phoneChanged) {
        setPhoneLoading(true);
        await updatePhone(phone.trim());
        setOriginalPhone(phone.trim());
        setStatus({ type: "success", message: t("phoneUpdateSuccess", "settings") });
        setPhoneLoading(false);
      }

      if (!emailChanged && !phoneChanged) {
        onClose();
        return;
      }

      setTimeout(() => onClose(), 1500);
    } catch {
      setEmailLoading(false);
      setPhoneLoading(false);
      setStatus({ type: "error", message: t("contactUpdateError", "settings") });
    }
  };

  const isLoading = emailLoading || phoneLoading;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-card rounded-2xl shadow-2xl border border-border w-full max-w-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-[#ff3131] to-[#ff914d] px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">{t("contactModalTitle", "settings")}</h2>
                <p className="text-white/80 text-sm mt-0.5">{t("contactModalSubtitle", "settings")}</p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <X size={18} className="text-white" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-5 space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                {t("emailLabel", "settings")}
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("emailPlaceholder", "settings")}
                  className="w-full pl-10 pr-4 py-2.5 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#ff3131]/50 focus:border-[#ff3131] transition-all text-sm"
                />
              </div>
              {emailChanged && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="text-xs text-amber-600 mt-1.5 flex items-center gap-1"
                >
                  <AlertCircle size={12} />
                  {t("emailConfirmNote", "settings")}
                </motion.p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                {t("phoneLabel", "settings")}
              </label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t("phonePlaceholder", "settings")}
                  className="w-full pl-10 pr-4 py-2.5 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#ff3131]/50 focus:border-[#ff3131] transition-all text-sm"
                />
              </div>
            </div>

            {/* Status message */}
            <AnimatePresence>
              {status && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium ${
                    status.type === "success"
                      ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                      : "bg-red-500/10 text-red-600 border border-red-500/20"
                  }`}
                >
                  {status.type === "success" ? <Check size={16} /> : <AlertCircle size={16} />}
                  {status.message}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl border border-border text-foreground hover:bg-muted transition-colors text-sm font-medium disabled:opacity-50"
            >
              {t("cancelBtn", "settings")}
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading || (!emailChanged && !phoneChanged)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white font-medium hover:shadow-lg hover:shadow-[#ff3131]/25 transition-all text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading && <Loader2 size={16} className="animate-spin" />}
              {isLoading ? t("saving", "settings") : t("saveBtn", "settings")}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Change Password Modal ─────────────────────────────────────────
function PasswordModal({
  isOpen,
  onClose,
  t,
}: {
  isOpen: boolean;
  onClose: () => void;
  t: (key: string, section?: string) => string;
}) {
  const { changePassword } = useAuthStore();
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCurrentPwd("");
      setNewPwd("");
      setConfirmPwd("");
      setShowCurrent(false);
      setShowNew(false);
      setShowConfirm(false);
      setStatus(null);
    }
  }, [isOpen]);

  const validate = (): string | null => {
    if (newPwd.length < 6) return t("passwordTooShort", "settings");
    if (newPwd !== confirmPwd) return t("passwordMismatch", "settings");
    return null;
  };

  const handleSubmit = async () => {
    const error = validate();
    if (error) {
      setStatus({ type: "error", message: error });
      return;
    }

    setIsLoading(true);
    setStatus(null);
    try {
      await changePassword(currentPwd, newPwd);
      setStatus({ type: "success", message: t("passwordChangeSuccess", "settings") });
      setTimeout(() => onClose(), 1500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t("passwordChangeError", "settings");
      setStatus({ type: "error", message: msg });
    } finally {
      setIsLoading(false);
    }
  };

  const isValid = currentPwd.length > 0 && newPwd.length >= 6 && confirmPwd.length > 0;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-card rounded-2xl shadow-2xl border border-border w-full max-w-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-[#ff3131] to-[#ff914d] px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">{t("passwordModalTitle", "settings")}</h2>
                <p className="text-white/80 text-sm mt-0.5">{t("passwordModalSubtitle", "settings")}</p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <X size={18} className="text-white" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-5 space-y-5">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                {t("currentPassword", "settings")} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPwd}
                  onChange={(e) => setCurrentPwd(e.target.value)}
                  placeholder={t("currentPasswordPlaceholder", "settings")}
                  className="w-full pl-10 pr-10 py-2.5 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#ff3131]/50 focus:border-[#ff3131] transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                {t("newPassword", "settings")} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={showNew ? "text" : "password"}
                  value={newPwd}
                  onChange={(e) => setNewPwd(e.target.value)}
                  placeholder={t("newPasswordPlaceholder", "settings")}
                  className="w-full pl-10 pr-10 py-2.5 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#ff3131]/50 focus:border-[#ff3131] transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {/* Password strength indicator */}
              {newPwd.length > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => {
                      const strength =
                        newPwd.length >= 12 && /[A-Z]/.test(newPwd) && /[0-9]/.test(newPwd) && /[^A-Za-z0-9]/.test(newPwd)
                          ? 4
                          : newPwd.length >= 8 && (/[A-Z]/.test(newPwd) || /[0-9]/.test(newPwd))
                          ? 3
                          : newPwd.length >= 6
                          ? 2
                          : 1;
                      return (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            level <= strength
                              ? strength <= 1
                                ? "bg-red-500"
                                : strength === 2
                                ? "bg-amber-500"
                                : strength === 3
                                ? "bg-blue-500"
                                : "bg-emerald-500"
                              : "bg-muted-foreground/20"
                          }`}
                        />
                      );
                    })}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("passwordRequirements", "settings")}
                  </p>
                </motion.div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                {t("confirmPassword", "settings")} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPwd}
                  onChange={(e) => setConfirmPwd(e.target.value)}
                  placeholder={t("confirmPasswordPlaceholder", "settings")}
                  className={`w-full pl-10 pr-10 py-2.5 bg-muted border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all text-sm ${
                    confirmPwd.length > 0 && newPwd !== confirmPwd
                      ? "border-red-400 focus:ring-red-400/50 focus:border-red-400"
                      : confirmPwd.length > 0 && newPwd === confirmPwd
                      ? "border-emerald-400 focus:ring-emerald-400/50 focus:border-emerald-400"
                      : "border-border focus:ring-[#ff3131]/50 focus:border-[#ff3131]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {confirmPwd.length > 0 && newPwd !== confirmPwd && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-red-500 mt-1 flex items-center gap-1"
                >
                  <AlertCircle size={12} />
                  {t("passwordMismatch", "settings")}
                </motion.p>
              )}
              {confirmPwd.length > 0 && newPwd === confirmPwd && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-emerald-500 mt-1 flex items-center gap-1"
                >
                  <Check size={12} />
                  ✓
                </motion.p>
              )}
            </div>

            {/* Status message */}
            <AnimatePresence>
              {status && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium ${
                    status.type === "success"
                      ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                      : "bg-red-500/10 text-red-600 border border-red-500/20"
                  }`}
                >
                  {status.type === "success" ? <Check size={16} /> : <AlertCircle size={16} />}
                  {status.message}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl border border-border text-foreground hover:bg-muted transition-colors text-sm font-medium disabled:opacity-50"
            >
              {t("cancelBtn", "settings")}
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading || !isValid}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white font-medium hover:shadow-lg hover:shadow-[#ff3131]/25 transition-all text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading && <Loader2 size={16} className="animate-spin" />}
              {isLoading ? t("changingPassword", "settings") : t("changePasswordBtn", "settings")}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Main Settings Page ────────────────────────────────────────────
export function Settings() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuthStore();
  const { language, setLanguage, t } = useLanguageStore();
  const { isDarkMode, toggleDarkMode } = useUIStore();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Modal states
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  const userInfo = {
    name: user?.full_name || t("defaultUser", "settings"),
    email: user?.email || t("noEmail", "settings"),
    phone: user?.phone || t("noPhone", "settings"),
    location: user?.location || t("noAddress", "settings"),
    avatar: user?.avatar_url || "",
  };

  const allSections = [
    {
      title: t("secAccount", "settings"),
      icon: User,
      items: [
        { label: t("itemPersonalInfo", "settings"), icon: User, action: "profile" },
        { label: t("itemContact", "settings"), icon: Mail, action: "contact" },
        { label: t("itemAddress", "settings"), icon: MapPin, action: "address" },
        { label: t("itemPassword", "settings"), icon: Lock, action: "password" },
      ],
    },
    {
      title: t("secPrivacy", "settings"),
      icon: Shield,
      items: [
        { label: t("itemPrivacy", "settings"), icon: Eye, action: "privacy" },
        { label: t("itemSecurity", "settings"), icon: Shield, action: "security" },
        { label: t("itemProfileVisibility", "settings"), icon: Eye, action: "profile-visibility" },
      ],
    },
    {
      title: t("secNotifications", "settings"),
      icon: Bell,
      items: [
        { label: t("itemPushNav", "settings"), icon: Bell, toggle: true, value: pushNotifications, onChange: setPushNotifications },
        { label: t("itemEmailNav", "settings"), icon: Mail, toggle: true, value: emailNotifications, onChange: setEmailNotifications },
        { label: t("itemSound", "settings"), icon: Volume2, toggle: true, value: soundEnabled, onChange: setSoundEnabled },
      ],
    },
    {
      title: t("secAppearance", "settings"),
      icon: Palette,
      items: [
        { label: t("itemDarkMode", "settings"), icon: isDarkMode ? Moon : Sun, toggle: true, value: isDarkMode, onChange: toggleDarkMode },
        { label: t("itemLanguage", "settings"), icon: Globe, isLanguageSelect: true },
      ],
    },
    {
      title: t("secAbout", "settings"),
      icon: Info,
      items: [
        { label: t("itemTerms", "settings"), icon: Info, action: "terms" },
        { label: t("itemPolicy", "settings"), icon: Shield, action: "policy" },
        { label: t("itemVersion", "settings"), icon: Info, value: "1.0.0" },
      ],
    },
  ];

  const settingsSections = isAuthenticated
    ? allSections
    : allSections.filter(
        (sec) =>
          sec.title === t("secAppearance", "settings") || sec.title === t("secAbout", "settings")
      );

  const handleAction = async (action: string) => {
    switch (action) {
      case "profile":
        setProfileModalOpen(true);
        return;
      case "contact":
        setContactModalOpen(true);
        return;
      case "password":
        setPasswordModalOpen(true);
        return;
      case "logout":
        await logout();
        navigate("/login");
        return;
      default:
        alert(t("featureDev", "settings"));
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-[#ff3131] to-[#ff914d] rounded-xl flex items-center justify-center shadow-sm">
              <User className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl sm:text-3xl font-bold text-foreground">{t("title", "settings")}</h1>
              <p className="text-xs sm:text-base text-muted-foreground hidden sm:block">{t("subtitle", "settings")}</p>
            </div>
          </div>
        </motion.div>

        {/* Profile Card */}
        {isAuthenticated && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl shadow-sm border border-border p-4 sm:p-6 mb-4 sm:mb-6 transition-colors duration-200"
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              {userInfo.avatar ? (
                <ImageWithFallback
                  src={userInfo.avatar}
                  alt={userInfo.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-[#ff3131]"
                />
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-[#ff3131] to-[#ff914d] flex items-center justify-center text-white font-bold text-3xl shadow-inner border-2 border-transparent">
                  {userInfo.name.charAt(0).toUpperCase()}
                </div>
              )}
              <button className="absolute bottom-0 right-0 w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all border-2 border-card">
                <Camera size={14} />
              </button>
            </div>
            <div className="flex-1">
              <h2 className="text-lg sm:text-xl font-bold text-card-foreground">{userInfo.name}</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">{userInfo.email}</p>
              <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <MapPin size={12} className="sm:w-4 sm:h-4" />
                {userInfo.location}
              </p>
            </div>
          </div>
        </motion.div>
        )}

        {/* Settings Sections */}
        <div className="space-y-4 sm:space-y-6">
          {settingsSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + sectionIndex * 0.1 }}
              className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden transition-colors duration-200"
            >
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-border">
                <h3 className="font-bold text-card-foreground flex items-center gap-2 text-sm sm:text-base">
                  <section.icon size={18} className="text-[#ff3131] sm:w-5 sm:h-5" />
                  {section.title}
                </h3>
              </div>
              <div className="divide-y divide-border">
                {section.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className={`px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between ${
                      item.toggle || item.action || item.isLanguageSelect ? "cursor-pointer hover:bg-accent hover:text-accent-foreground" : ""
                    } transition-colors`}
                    onClick={() => item.action && handleAction(item.action)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-muted rounded-lg flex items-center justify-center">
                        <item.icon size={16} className="text-muted-foreground sm:w-5 sm:h-5" />
                      </div>
                      <span className="text-sm sm:text-base font-medium">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.value && !item.toggle && !item.isLanguageSelect && (
                        <span className="text-xs sm:text-sm text-muted-foreground">{item.value}</span>
                      )}
                      {item.isLanguageSelect && (
                        <select
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="bg-muted border border-border text-foreground text-xs sm:text-sm rounded-md px-2 py-1 outline-none cursor-pointer focus:ring-2 focus:ring-[#ff3131]"
                        >
                          <option className="bg-background text-foreground" value="vi">Tiếng Việt</option>
                          <option className="bg-background text-foreground" value="en">English</option>
                        </select>
                      )}
                      {item.toggle && item.onChange && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            item.onChange(!item.value);
                          }}
                          className={`relative w-11 h-6 sm:w-12 sm:h-7 rounded-full transition-colors ${
                            item.value ? "bg-gradient-to-r from-[#ff3131] to-[#ff914d]" : "bg-muted-foreground/30"
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 left-0.5 w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full transition-transform ${
                              item.value ? "translate-x-5 sm:translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>
                      )}
                      {item.action && !item.isLanguageSelect && (
                        <ChevronRight size={18} className="text-muted-foreground sm:w-5 sm:h-5" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Danger Zone */}
        {isAuthenticated && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-card rounded-2xl shadow-sm border border-destructive/20 overflow-hidden mt-4 sm:mt-6 transition-colors duration-200"
        >
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-destructive/20 bg-destructive/10">
            <h3 className="font-bold text-destructive text-sm sm:text-base">{t("dangerZone", "settings")}</h3>
          </div>
          <div className="px-4 sm:px-6 py-3 sm:py-4 space-y-3">
            <button
              onClick={() => handleAction("logout")}
              className="w-full px-4 py-2.5 sm:py-3 bg-orange-500/10 text-orange-500 rounded-xl font-semibold hover:bg-orange-500/20 transition-all text-sm sm:text-base"
            >
              {t("logout", "settings")}
            </button>
            <button
              onClick={() => handleAction("delete-account")}
              className="w-full px-4 py-2.5 sm:py-3 bg-destructive/10 text-destructive rounded-xl font-semibold hover:bg-destructive/20 transition-all text-sm sm:text-base"
            >
              {t("deleteAccount", "settings")}
            </button>
          </div>
        </motion.div>
        )}
      </div>

      {/* Modals */}
      <ProfileModal isOpen={profileModalOpen} onClose={() => setProfileModalOpen(false)} t={t} />
      <ContactModal isOpen={contactModalOpen} onClose={() => setContactModalOpen(false)} t={t} />
      <PasswordModal isOpen={passwordModalOpen} onClose={() => setPasswordModalOpen(false)} t={t} />
    </div>
  );
}
