import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "solid" | "outline" | "ghost" | "dark";
type Size = "sm" | "md";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium " +
  "transition-[background-color,border-color,color,transform] duration-200 " +
  "active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  solid:
    "bg-[var(--lagoon)] text-[var(--ink)] border border-transparent hover:bg-[#6fd6d2]",
  outline:
    "border border-[var(--line)] bg-transparent text-[var(--ink)] hover:border-[var(--ink)]",
  ghost: "text-[var(--ink)] hover:bg-[var(--line)]/60 border border-transparent",
  dark: "bg-[var(--ink)] text-[var(--shell)] border border-transparent hover:bg-[#0f1d2b]",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-[0.82rem]",
  md: "px-6 py-3 text-[0.9rem]",
};

interface StyleProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

type LinkProps = StyleProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

type NativeButtonProps = StyleProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: never };

type AnchorRest = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

/** Narrows the leftover props to the anchor branch. */
function isAnchor(rest: object): rest is AnchorRest {
  return typeof (rest as { href?: unknown }).href === "string";
}

/**
 * One button that renders as <a> when given an href and <button> otherwise,
 * so a link never has to be faked with a click handler.
 */
export function Button(props: LinkProps | NativeButtonProps) {
  const { variant = "solid", size = "md", className = "", children, ...rest } = props;
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if (isAnchor(rest)) {
    const external = rest.href.startsWith("http");

    return (
      <a
        className={classes}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
