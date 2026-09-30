import Image from "next/image";
import type { Project } from "@/types";

interface ProjectVisualProps {
  title: string;
  image?: string;
  imageKind?: Project["imageKind"];
  /** Short label drawn into the placeholder when there is no image at all. */
  hint?: string;
  priority?: boolean;
  className?: string;
}

const frame =
  "relative aspect-[16/10] overflow-hidden rounded-2xl border border-[var(--line)] bg-[#eef8f7]";

/**
 * Three cases, in order of preference:
 *   1. a real screenshot (PNG/JPG) — through next/image, with a descriptive alt
 *   2. designed cover art (SVG) — a plain <img>, decorative, empty alt
 *   3. nothing yet — a deliberate placeholder, never a broken image
 */
export function ProjectVisual({
  title,
  image,
  imageKind,
  hint,
  priority = false,
  className = "",
}: ProjectVisualProps) {
  if (image) {
    const isVector = image.endsWith(".svg");

    if (isVector) {
      return (
        <div className={`${frame} ${className}`}>
          {/*
            next/image refuses SVG unless `dangerouslyAllowSVG` is turned on
            globally, which would also apply to any remote SVG. These covers are
            local, hand-written and ~4 KB, so a plain <img> is both safer and
            smaller than an optimised raster would be.
            Decorative: the project title sits directly beside it.
          */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt=""
            width={1200}
            height={750}
            loading={priority ? "eager" : "lazy"}
            className="h-full w-full object-cover"
          />
        </div>
      );
    }

    return (
      <div className={`${frame} ${className}`}>
        <Image
          src={image}
          alt={
            imageKind === "screenshot"
              ? `Screenshot of the ${title} interface`
              : ""
          }
          fill
          sizes="(max-width: 768px) 100vw, 55vw"
          className="object-cover"
          priority={priority}
        />
      </div>
    );
  }

  return (
    <div
      className={`${frame} flex items-center justify-center ${className}`}
      role="img"
      aria-label={`${title} — screenshot not yet added`}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent 0 14px, rgba(22,41,60,0.045) 14px 15px)",
        }}
      />
      <span className="relative text-[0.7rem] uppercase tracking-[0.18em] text-[var(--ink-faint)]">
        {hint ?? "Screenshot"}
      </span>
    </div>
  );
}
