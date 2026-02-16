import { PortableTextRenderer } from "@/components/sanity/portable-text";
import { cn } from "@/lib/utils";

type TextSectionProps = {
  heading?: string;
  body: any[];
  alignment?: "left" | "center";
};

function TextSection({ heading, body, alignment = "left" }: TextSectionProps) {
  return (
    <section className="py-(--space-12) lg:py-(--space-16)">
      <div
        className={cn(
          "container-site max-w-3xl",
          alignment === "center" && "mx-auto text-center"
        )}
      >
        {heading && (
          <h2 className="font-display text-3xl lg:text-4xl text-espresso-600 mb-(--space-6)">
            {heading}
          </h2>
        )}
        <PortableTextRenderer value={body} />
      </div>
    </section>
  );
}

export { TextSection, type TextSectionProps };
