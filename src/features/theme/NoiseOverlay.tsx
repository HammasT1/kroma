const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.55'/%3E%3C/svg%3E\")";

/** Slow accent-colored gradient blobs (transform-only) plus a fine film-grain layer. */
export function NoiseOverlay() {
  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[2] overflow-hidden">
        <div className="blob blob-a" />
        <div className="blob blob-b" />
      </div>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[60] opacity-[0.07]"
        style={{ backgroundImage: NOISE }}
      />
    </>
  );
}
