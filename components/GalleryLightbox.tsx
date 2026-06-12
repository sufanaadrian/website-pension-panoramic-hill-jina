import Image from "next/image";

/**
 * Pure-CSS gallery + lightbox — intentionally NO JavaScript.
 *
 * "Show all" uses a native <details> element and the fullscreen viewer uses
 * the `:target` pseudo-class (anchor links). This means the gallery works even
 * if the page's JS never hydrates (e.g. flaky mobile Safari), which is exactly
 * the failure visitors were hitting on iPhone.
 */
export default function GalleryLightbox({
  images,
  name,
  previewLimit,
  accentColor,
  showAllLabel,
}: {
  images: string[];
  name: string;
  previewLimit?: number;
  accentColor?: string;
  showAllLabel?: string;
}) {
  if (images.length === 0) return null;

  const limit = previewLimit && previewLimit > 0 ? previewLimit : images.length;
  const preview = images.slice(0, limit);
  const rest = images.slice(limit);
  const n = images.length;

  const accent = accentColor ?? "#6B7280";

  // Cycle through a few aspect ratios so the gallery reads as a varied,
  // Pinterest-style mosaic instead of a uniform grid of identical tiles.
  const ASPECTS = ["aspect-[3/4]", "aspect-square", "aspect-[4/3]", "aspect-[4/5]", "aspect-[16/10]", "aspect-square"];

  const Thumb = ({ url, i }: { url: string; i: number }) => (
    <a
      href={`#lb-${i}`}
      className={`group relative block w-full mb-4 break-inside-avoid overflow-hidden rounded-2xl cursor-zoom-in ${ASPECTS[i % ASPECTS.length]}`}
      aria-label={`${name} — deschide foto ${i + 1}`}
    >
      <Image
        src={url}
        alt={`${name} — foto ${i + 1}`}
        fill
        className="object-cover pointer-events-none transition-transform duration-300 group-hover:scale-105"
      />
    </a>
  );

  return (
    <div>
      <div className="columns-2 md:columns-3 gap-4">
        {preview.map((url, i) => (
          <Thumb key={i} url={url} i={i} />
        ))}
      </div>

      {rest.length > 0 && (
        <details className="group mt-4">
          <summary className="mb-4 list-none [&::-webkit-details-marker]:hidden group-open:hidden text-center cursor-pointer">
            <span
              className="inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-full border-2 transition-colors"
              style={{ borderColor: accent, color: accent }}
            >
              {showAllLabel ?? `Vezi toate (${n})`}
            </span>
          </summary>
          <div className="columns-2 md:columns-3 gap-4">
            {rest.map((url, i) => (
              <Thumb key={i} url={url} i={i + limit} />
            ))}
          </div>
        </details>
      )}

      {/* Fullscreen viewers — hidden until their anchor is the URL :target. */}
      {images.map((url, i) => {
        const prev = (i - 1 + n) % n;
        const next = (i + 1) % n;
        return (
          <div
            key={i}
            id={`lb-${i}`}
            className="hidden target:flex fixed inset-0 z-[100] bg-black/90 items-center justify-center p-4 sm:p-8"
          >
            {/* Tap anywhere on the backdrop to close. */}
            <a href="#gallery-close" className="absolute inset-0 z-0" aria-label="Închide" />

            <a
              href="#gallery-close"
              className="absolute top-4 right-4 z-10 w-11 h-11 flex items-center justify-center text-white/80 hover:text-white text-3xl leading-none"
              aria-label="Închide"
            >
              ×
            </a>

            {n > 1 && (
              <>
                <a
                  href={`#lb-${prev}`}
                  className="absolute left-2 sm:left-4 z-10 w-11 h-11 flex items-center justify-center text-white/70 hover:text-white text-3xl leading-none"
                  aria-label="Foto anterioară"
                >
                  ‹
                </a>
                <a
                  href={`#lb-${next}`}
                  className="absolute right-2 sm:right-4 z-10 w-11 h-11 flex items-center justify-center text-white/70 hover:text-white text-3xl leading-none"
                  aria-label="Foto următoare"
                >
                  ›
                </a>
              </>
            )}

            <div className="relative z-[5] max-w-5xl w-full h-full pointer-events-none">
              <Image
                src={url}
                alt={`${name} — foto ${i + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
