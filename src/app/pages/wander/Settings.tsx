import { useState } from "react";
import { motion } from "motion/react";
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
  Check
} from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";

export function Settings() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { language, setLanguage, t } = useLanguageStore();
  const { isDarkMode, toggleDarkMode } = useUIStore();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const userInfo = {
    name: user?.full_name || t("defaultUser", "settings"),
    email: user?.email || t("noEmail", "settings"),
    phone: t("noPhone", "settings"), // Backend usually doesn't return phone right away
    location: t("noAddress", "settings"),
    avatar: user?.avatar_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  };

  const settingsSections = [
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

  const handleAction = async (action: string) => {
    if (action === "logout") {
      await logout();
      navigate("/login");
      return;
    }

    alert(t("featureDev", "settings"));
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl shadow-sm border border-border p-4 sm:p-6 mb-4 sm:mb-6 transition-colors duration-200"
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <ImageWithFallback
                src={userInfo.avatar}
                alt={userInfo.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover"
              />
              <button className="absolute bottom-0 right-0 w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all">
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
      </div>
    </div>
  );
}
