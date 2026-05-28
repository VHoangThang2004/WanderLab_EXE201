import { Link } from "react-router";
import logo from "figma:asset/e67ca046183988677d203e232d331dc6c254a541.png";

interface WanderLogoProps {
  /** Size variant: "sm" for footer, "md" for navbar (default), "lg" for auth pages */
  size?: "sm" | "md" | "lg";
  /** Whether to wrap in a Link to "/" */
  asLink?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { img: "h-7", text: "text-lg" },
  md: { img: "h-9", text: "text-xl" },
  lg: { img: "h-11", text: "text-2xl" },
};

const gradientStyle: React.CSSProperties = {
  background: "linear-gradient(to right, #FF3131, #FF914D)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

function LogoContent({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const { img, text } = sizeMap[size];
  return (
    <span className="flex items-center gap-2.5">
      <img
        src={logo}
        alt="WanderLab icon"
        className={`${img} w-auto object-contain flex-shrink-0`}
        style={{ imageRendering: "crisp-edges" }}
      />
      <span
        className={`${text} font-bold tracking-tight leading-none`}
        style={gradientStyle}
      >
        WanderLab
      </span>
    </span>
  );
}

export function WanderLogo({ size = "md", asLink = true, className = "" }: WanderLogoProps) {
  if (asLink) {
    return (
      <Link to="/" className={`inline-flex items-center ${className}`} aria-label="WanderLab – Trang chủ">
        <LogoContent size={size} />
      </Link>
    );
  }
  return (
    <span className={`inline-flex items-center ${className}`}>
      <LogoContent size={size} />
    </span>
  );
}
