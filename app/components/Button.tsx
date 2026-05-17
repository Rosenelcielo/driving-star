import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "icon";

type BaseProps = {
  variant?: ButtonVariant;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
};

type ButtonProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement>;

type ButtonLinkProps = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

function getButtonClass(variant: ButtonVariant, className = "") {
  const variantClass = variant === "primary" ? "" : `game-button--${variant}`;
  return ["game-button", variantClass, className].filter(Boolean).join(" ");
}

export function Button({ className = "", variant = "primary", icon, children, type = "button", ...props }: ButtonProps) {
  return (
    <button className={getButtonClass(variant, className)} type={type} {...props}>
      {icon}
      {variant === "icon" ? <span className="sr-only">{children}</span> : children}
    </button>
  );
}

export function ButtonLink({ className = "", variant = "primary", icon, children, href, ...props }: ButtonLinkProps) {
  return (
    <Link className={getButtonClass(variant, className)} href={href} {...props}>
      {icon}
      {variant === "icon" ? <span className="sr-only">{children}</span> : children}
    </Link>
  );
}
