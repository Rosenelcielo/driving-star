import type { HTMLAttributes, ReactNode } from "react";

type CardProps = HTMLAttributes<HTMLElement> & {
  as?: "article" | "section" | "div" | "aside";
  selected?: boolean;
  clickable?: boolean;
  children: ReactNode;
};

export function Card({ as: Component = "article", className = "", selected = false, clickable = false, children, ...props }: CardProps) {
  const classes = ["game-card", clickable ? "game-card--clickable" : "", selected ? "game-card--selected" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
}
