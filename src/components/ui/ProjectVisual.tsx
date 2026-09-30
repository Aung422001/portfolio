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
 * Renders a project's screenshot, or a deliberate placeholder when one has not
 * been added yet — never a broken image.
 *
 * Screenshots are pre-cropped to 16:10 and anchored to the top, so the app's
 * header and headline numbers are what show rather than a slice of its middle.
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
          className="object-cover object-top"
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
