import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import { Card } from "./card";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import type { STORES_QUERYResult } from "@/sanity/types";

type StoreHours = STORES_QUERYResult[number]["hours"][number];

type StoreStatus = {
  isOpen: boolean;
  closingSoon: boolean;
  todayHours: StoreHours | null;
  specialHoursLabel?: string;
};

type StoreCardProps = {
  store: STORES_QUERYResult[number];
  variant?: "full" | "compact";
  className?: string;
};

const CLOSING_SOON_MINUTES = 30;

function getStoreStatus(hours: StoreHours[]): StoreStatus {
  const now = new Date();

  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const dayName = days[now.getDay()];
  const todayHours = hours.find((h) => h.day === dayName) ?? null;

  if (!todayHours || todayHours.closed || !todayHours.open || !todayHours.close) {
    return { isOpen: false, closingSoon: false, todayHours };
  }

  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  const isOpen = currentTime >= todayHours.open && currentTime < todayHours.close;
  const closingSoon = isOpen && isClosingSoon(now, todayHours.close);
  return { isOpen, closingSoon, todayHours };
}

function isClosingSoon(now: Date, closeTime: string): boolean {
  const [closeH, closeM] = closeTime.split(":").map(Number);
  const closeMinutes = closeH * 60 + closeM;
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  return closeMinutes - nowMinutes <= CLOSING_SOON_MINUTES && closeMinutes - nowMinutes > 0;
}

function formatHoursRange(hours: StoreHours[]): string[] {
  const weekday = hours.find((h) => h.day === "monday");
  const weekend = hours.find((h) => h.day === "saturday");

  const lines: string[] = [];
  if (weekday && !weekday.closed && weekday.open && weekday.close) {
    lines.push(`Mon-Fri ${weekday.open}–${weekday.close}`);
  }
  if (weekend && !weekend.closed && weekend.open && weekend.close) {
    lines.push(`Sat-Sun ${weekend.open}–${weekend.close}`);
  }
  return lines;
}

function StoreCard({ store, variant = "full", className }: StoreCardProps) {
  const { isOpen, closingSoon, todayHours, specialHoursLabel } = getStoreStatus(store.hours);
  const hoursLines = formatHoursRange(store.hours);
  const directionsUrl = store.coordinates?.lat != null && store.coordinates?.lng != null
    ? `https://www.google.com/maps/dir/?api=1&destination=${store.coordinates.lat},${store.coordinates.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address + " " + store.city)}`;

  return (
    <Card
      className={cn(
        variant === "full" && "lg:flex lg:flex-row",
        className
      )}
    >
      <div
        className={cn(
          "overflow-hidden",
          variant === "full"
            ? "lg:w-2/5 lg:rounded-l-(--radius-lg) lg:rounded-tr-none rounded-t-(--radius-lg)"
            : "rounded-t-(--radius-lg)",
          "aspect-[4/3] lg:aspect-auto"
        )}
      >
        <Image
          src={urlFor(store.image).width(500).height(375).url()}
          alt={store.image.alt || store.name}
          width={500}
          height={375}
          className="w-full h-full object-cover"
          {...(store.image.asset?.metadata?.lqip ? { placeholder: "blur" as const, blurDataURL: store.image.asset.metadata.lqip } : {})}
        />
      </div>
      <div className={cn("p-(--space-4) flex flex-col gap-(--space-2)", variant === "full" && "lg:flex-1")}>
        <span className="text-xs font-medium uppercase tracking-wider text-forest-600">
          {store.city}
        </span>
        <h3 className="font-body font-medium text-2xl text-espresso-600">
          {store.name}
        </h3>
        <p className="text-base text-stone">{store.address}</p>
        <div className="text-sm text-stone space-y-0.5">
          {hoursLines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        {specialHoursLabel && (
          <div className="text-xs font-medium text-terracotta-600 bg-terracotta-50 px-2 py-1 rounded-(--radius-sm)">
            ⚠️ {specialHoursLabel}
          </div>
        )}
        <div className="flex items-center gap-2 text-sm">
          <span
            className={cn(
              "w-2 h-2 rounded-full",
              closingSoon ? "bg-warning" : isOpen ? "bg-success" : "bg-error"
            )}
            aria-hidden="true"
          />
          <span className={closingSoon ? "text-warning" : isOpen ? "text-success" : "text-error"}>
            {closingSoon
              ? "Closing soon"
              : isOpen
                ? "Open now"
                : "Closed"}
            {todayHours && !todayHours.closed && todayHours.open && todayHours.close && (
              <span className="text-pebble">
                {" "}· {isOpen ? `until ${todayHours.close}` : `opens ${todayHours.open}`}
              </span>
            )}
          </span>
        </div>
        <div className="mt-auto pt-(--space-2)">
          <Button variant="tertiary" size="sm" asChild>
            <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
              Get Directions →
            </a>
          </Button>
        </div>
      </div>
    </Card>
  );
}

export { StoreCard, type StoreCardProps, getStoreStatus };
