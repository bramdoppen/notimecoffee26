import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type CardProps = HTMLAttributes<HTMLDivElement>;

function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-(--radius-lg) shadow-(--shadow-sm)",
        "transition-all duration-(--transition-base)",
        "hover:shadow-(--shadow-md) hover:-translate-y-0.5",
        className
      )}
      {...props}
    />
  );
}

function CardImage({
  className,
  aspectRatio = "4/3",
  ...props
}: HTMLAttributes<HTMLDivElement> & { aspectRatio?: string }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-t-(--radius-lg)",
        className
      )}
      style={{ aspectRatio }}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-(--space-4)", className)} {...props} />
  );
}

function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("font-body font-medium text-xl text-espresso-600", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-base text-stone line-clamp-2", className)}
      {...props}
    />
  );
}

export { Card, CardImage, CardContent, CardTitle, CardDescription };
