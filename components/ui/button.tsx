import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ElementType,
  type ComponentPropsWithRef,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "font-body font-medium",
    "transition-all duration-(--transition-fast)",
    "focus-visible:outline-2 focus-visible:outline-forest-500 focus-visible:outline-offset-2",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
    "cursor-pointer",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-forest-600 text-white",
          "hover:bg-forest-500 hover:shadow-(--shadow-md)",
          "active:bg-forest-700 active:shadow-none",
        ],
        secondary: [
          "bg-transparent text-forest-600",
          "border-[1.5px] border-forest-600",
          "hover:bg-forest-600 hover:text-white",
          "active:bg-forest-700 active:border-forest-700 active:text-white",
        ],
        tertiary: [
          "bg-transparent text-forest-600",
          "hover:bg-sage-100 hover:underline",
          "active:bg-sage-200",
        ],
        accent: [
          "bg-terracotta-500 text-white",
          "hover:bg-terracotta-400 hover:shadow-(--shadow-md)",
          "active:bg-terracotta-600 active:shadow-none",
        ],
      },
      size: {
        sm: "px-4 py-2 text-sm min-h-9 rounded-(--radius-md)",
        md: "px-6 py-3 text-base min-h-11 rounded-(--radius-md)",
        lg: "px-8 py-4 text-lg min-h-[52px] rounded-(--radius-md)",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean;
    asChild?: boolean;
  };

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading,
      asChild,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    // When asChild is true, render the child element directly with button styles.
    // This enables <Button asChild><Link href="...">Click</Link></Button>
    // without nesting a <button> inside an <a>.
    if (asChild) {
      // Extract the single child element and clone it with button classes
      const child = children as React.ReactElement<any>;
      if (child && typeof child === "object" && "props" in child) {
        const { className: childClassName, ...childProps } = child.props;
        return (
          <child.type
            {...childProps}
            className={cn(
              buttonVariants({ variant, size }),
              className,
              childClassName
            )}
          />
        );
      }
    }

    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        aria-disabled={loading || undefined}
        {...props}
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
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
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <span>{children}</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants, type ButtonProps };
