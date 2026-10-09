import Image from "next/image";

/**
 * SiteArt — art-directed imagery for Unschool Academy.
 *
 * Two cohesive sets, both original AI-generated staging assets:
 * - Editorial (adult surfaces): cinematic warm photography style.
 * - Storybook (kids surfaces): original 2D gouache storybook style.
 *
 * Kids character portraits (char-momo/tara/bobo) and storybook scenes are
 * STAGING assets pending illustrator review + IP signoff — they must keep the
 * "staging artwork" label wherever they appear until the review lands.
 */

type ArtProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  /** aspect ratio bucket */
  ratio?: "wide" | "card" | "portrait";
  sizes?: string;
};

/** Framed art image with the site's standard rounded/border treatment. */
export function Art({ src, alt, className, priority, ratio = "wide", sizes }: ArtProps) {
  const ratioClass =
    ratio === "wide" ? "aspect-[16/10]" : ratio === "card" ? "aspect-[16/9]" : "aspect-[4/5]";
  return (
    <div
      className={[
        "relative overflow-hidden rounded-2xl border border-border bg-paper shadow-[0_18px_50px_-24px_rgba(21,34,59,0.35)]",
        ratioClass,
        className ?? "",
      ].join(" ")}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes ?? "(max-width: 768px) 100vw, 50vw"}
        className="object-cover"
      />
    </div>
  );
}

/** Small caption noting staging status for kids character art. */
export function StagingNote({ className }: { className?: string }) {
  return (
    <p className={`mt-2 text-xs text-slate ${className ?? ""}`}>
      Original staging artwork — pending illustrator review and IP sign-off.
    </p>
  );
}
