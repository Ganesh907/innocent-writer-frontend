import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
} from "react";
import HTMLFlipBook from "react-pageflip";
import { ArrowLeft, ArrowRight, BookOpen, Feather } from "lucide-react";

import { SEO } from "@/components/shared/SEO";
import { getPoetryBookPoems } from "@/features/poems/poemApi";

type BookPageProps = {
  pageNumber: number;
  poemName: string;
  image?: string;
  cover?: "front" | "back";
  /** Desktop spread only: forces left/right page shading. Mobile does not pass it. */
  side?: "left" | "right";
};

type FullImagePageProps = {
  image: string;
  alt: string;
  side: "left" | "right";
  eager?: boolean;
};

type BookPoem = {
  id: string;
  title: string;
  coverImage: string;
  poemImage: string;
};

type FlipBookHandle = {
  pageFlip: () => {
    flipPrev: () => void;
    flipNext: () => void;
  };
};

const COVER_IMAGE = "/images/BookCover.png";

// Author image shown on the LEFT page of the first spread (desktop only).
// The project zip contains /images/Writer.jpg. If your file is a PNG, change this to "/images/Writer.png".
const WRITER_IMAGE = "/images/Writer.jpg";

const MOBILE_QUERY = "(max-width: 767px)";

const PAPER_STYLE = {
  backgroundColor: "var(--gateway-page)",
  backgroundImage: `
    repeating-linear-gradient(
      to bottom,
      transparent 0,
      transparent 27px,
      var(--gateway-page-line) 28px
    )
  `,
  backgroundRepeat: "repeat",
  backgroundSize: "100% 28px",
  backgroundClip: "padding-box",
  backfaceVisibility: "hidden" as const,
  WebkitBackfaceVisibility: "hidden" as const,
};

const COVER_STYLE = {
  backgroundColor: "#17313b",
  backfaceVisibility: "hidden" as const,
  WebkitBackfaceVisibility: "hidden" as const,
};

// Soft shade next to the spine so full-size image pages look like book pages.
const SPINE_SHADE_LEFT =
  "linear-gradient(270deg, color-mix(in srgb, var(--gateway-cover-edge) 38%, transparent), transparent 14%)";
const SPINE_SHADE_RIGHT =
  "linear-gradient(90deg, color-mix(in srgb, var(--gateway-cover-edge) 38%, transparent), transparent 14%)";

const CoverRule = () => (
  <div
    aria-hidden="true"
    className="flex w-full max-w-[220px] items-center gap-3 text-[var(--gateway-cover-highlight)]"
  >
    <span className="h-px flex-1 bg-current opacity-80" />
    <span className="font-serif text-xl leading-none">❦</span>
    <span className="h-px flex-1 bg-current opacity-80" />
  </div>
);

const BookPage = forwardRef<HTMLDivElement, BookPageProps>(function BookPage(
  { pageNumber, poemName, image, cover, side },
  ref,
) {
  if (cover) {
    const isFront = cover === "front";

    return (
      <div
        ref={ref}
        className="gateway-page relative isolate box-border flex h-full w-full min-w-0 items-stretch justify-stretch overflow-hidden p-0 text-center"
        style={COVER_STYLE}
      >
        {/* Cover image */}
        <img
          src={COVER_IMAGE}
          alt=""
          aria-hidden="true"
          draggable={false}
          className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover object-center"
        />

        {/* Theme-aware classic book tint */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background: `
                linear-gradient(
                  180deg,
                  color-mix(in srgb, var(--gateway-cover) 28%, transparent) 0%,
                  transparent 38%,
                  color-mix(in srgb, var(--gateway-cover-edge) 78%, transparent) 100%
                ),
                linear-gradient(
                  90deg,
                  color-mix(in srgb, var(--gateway-cover-edge) 30%, transparent),
                  transparent 20%,
                  transparent 80%,
                  color-mix(in srgb, var(--gateway-cover-edge) 25%, transparent)
                )
              `,
          }}
        />

        {/* Antique book frame */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-[4px] z-[1] rounded-[2px] border border-[#e7c99a]/35 sm:inset-[7px]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-[12px] z-[1] border border-[#e7c99a]/80 sm:inset-[16px]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-[18px] z-[1] border border-white/25 sm:inset-[23px]"
        />

        <div className="relative z-[2] flex h-full min-h-0 w-full flex-col items-center justify-between overflow-hidden px-7 py-8 sm:px-10 sm:py-10 md:px-12 md:py-12">
          {/* Top ornament */}
          <div className="flex flex-col items-center gap-3">
            <span className="font-serif text-[10px] uppercase tracking-[0.25em] text-white/95 sm:text-xs">
              {isFront ? "A quiet world of words" : "Until we meet again"}
            </span>

            <CoverRule />
          </div>

          {/* Cover message */}
          <div className="flex w-full flex-col items-center">
            <div className="mb-4 flex size-12 items-center justify-center rounded-full border border-[#e7c99a]/80 bg-black/20 text-white sm:mb-5 sm:size-14">
              {isFront ? (
                <BookOpen size={27} strokeWidth={1.15} />
              ) : (
                <Feather size={26} strokeWidth={1.15} />
              )}
            </div>

            {isFront ? (
              <>
                <h1 className="font-serif text-[clamp(32px,5vw,54px)] font-medium leading-tight text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.8)]">
                  Enter the
                  <span className="block italic text-amber-200">
                    Poetry World
                  </span>
                </h1>

                <div className="my-5 sm:my-6">
                  <CoverRule />
                </div>

                <p className="max-w-[230px] font-serif text-sm italic leading-relaxed text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.8)] sm:text-base">
                  Turn the page. Let the words speak.
                </p>
              </>
            ) : (
              <>
                <h2 className="font-serif text-[clamp(32px,5vw,50px)] font-medium leading-tight text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.8)]">
                  The End
                </h2>

                <div className="my-5 sm:my-6">
                  <CoverRule />
                </div>

                <p className="max-w-[230px] font-serif text-sm italic leading-relaxed text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.8)] sm:text-base">
                  Keep a little poetry with you.
                </p>
              </>
            )}
          </div>

          {/* Bottom imprint */}
          <div className="flex flex-col items-center gap-2">
            <span
              className="font-serif text-xl text-amber-200"
              aria-hidden="true"
            >
              ✦
            </span>

            <p className="font-sans text-[8px] uppercase tracking-[0.28em] text-white/95 sm:text-[9px]">
              Innocent Writer
            </p>
          </div>
        </div>
      </div>
    );
  }

  const pageSide = side ?? (pageNumber % 2 === 0 ? "left" : "right");

  return (
    <div
      ref={ref}
      className={`gateway-page relative isolate box-border flex h-full w-full min-w-0 flex-col overflow-hidden text-[var(--gateway-text)] sm:p-4 ${
        pageSide === "left" ? "gateway-page--left" : "gateway-page--right"
      }`}
      style={PAPER_STYLE}
    >
      <header className="flex w-full flex-none items-center justify-between gap-2 border-b border-[var(--gateway-border)]  font-serif text-[clamp(9px,1vw,12px)]">
        <span className="shrink-0 font-semibold">Innocent Writer</span>

        <span className="min-w-0 max-w-[60%] truncate text-right">
          {poemName}
        </span>
      </header>

      {image && (
        <img
          src={image}
          alt={`${poemName}, page ${pageNumber}`}
          className=" h-[95%]! max-h-full w-full p-1  max-w-full select-none object-contain object-center"
          draggable={false}
          loading={pageNumber <= 2 ? "eager" : "lazy"}
        />
      )}

      <footer className="flex min-h-[22px] w-full flex-none items-center justify-center border-t border-[var(--gateway-border)] pt-1 font-serif text-[11px] text-[var(--gateway-text-muted)]">
        {pageNumber}
      </footer>
    </div>
  );
});

BookPage.displayName = "BookPage";

/**
 * Desktop spread only.
 * A full-size image page that fills the whole page exactly like the cover image
 * (used for the Writer image and for every poem cover image).
 */
const FullImagePage = forwardRef<HTMLDivElement, FullImagePageProps>(
  function FullImagePage({ image, alt, side, eager = false }, ref) {
    return (
      <div
        ref={ref}
        className="gateway-page relative isolate box-border flex h-full w-full min-w-0 items-stretch justify-stretch overflow-hidden p-0"
        style={COVER_STYLE}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-[4px] z-[1] rounded-[2px] border border-[#e7c99a]/35 sm:inset-[7px]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-[12px] z-[1] border border-[#e7c99a]/80 sm:inset-[7px]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-[18px] z-[1] border border-white/25 sm:inset-[7px]"
        />

        <img
          src={image}
          alt={alt}
          draggable={false}
          loading={eager ? "eager" : "lazy"}
          className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover object-center"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background: side === "left" ? SPINE_SHADE_LEFT : SPINE_SHADE_RIGHT,
          }}
        />
      </div>
    );
  },
);

FullImagePage.displayName = "FullImagePage";

/**
 * Desktop spread only.
 * Left page for a poem that has no cover image: a simple paper page with the title.
 */
const TitlePage = forwardRef<HTMLDivElement, { title: string }>(
  function TitlePage({ title }, ref) {
    return (
      <div
        ref={ref}
        className="gateway-page gateway-page--left relative isolate box-border flex h-full w-full min-w-0 flex-col items-center justify-center overflow-hidden p-6 text-center text-[var(--gateway-text)]"
        style={PAPER_STYLE}
      >
        <h2 className="font-serif text-[clamp(20px,3vw,34px)] font-medium leading-tight">
          {title}
        </h2>
      </div>
    );
  },
);

TitlePage.displayName = "TitlePage";

/**
 * Desktop spread only.
 * Plain left page placed before the back cover, so the last spread
 * (ornament page + back cover) is complete.
 */
const OrnamentPage = forwardRef<HTMLDivElement>(
  function OrnamentPage(_props, ref) {
    return (
      <div
        ref={ref}
        className="gateway-page gateway-page--left relative isolate box-border flex h-full w-full min-w-0 items-center justify-center overflow-hidden p-6 text-[var(--gateway-text-muted)]"
        style={PAPER_STYLE}
      >
        <span aria-hidden="true" className="font-serif text-4xl leading-none">
          ❦
        </span>
      </div>
    );
  },
);

OrnamentPage.displayName = "OrnamentPage";

export function PoetryBookPage() {
  const bookRef = useRef<FlipBookHandle | null>(null);

  const [isMobile, setIsMobile] = useState(
    () =>
      typeof window !== "undefined" && window.matchMedia(MOBILE_QUERY).matches,
  );
  const [isFlipping, setIsFlipping] = useState(false);
  const [isPoemsLoaded, setIsPoemsLoaded] = useState(false);

  const [poems, setPoems] = useState<BookPoem[]>([]);

  // Load poems before mounting the flipbook.
  useEffect(() => {
    getPoetryBookPoems()
      .then((items) => {
        setPoems(
          items.map((poem) => ({
            id: poem.id,
            title: poem.title,
            coverImage: poem.coverImageUrl ?? "",
            poemImage: poem.poemImageUrl ?? "",
          })),
        );
      })
      .catch((error) => {
        console.error("Failed to load poetry book poems:", error);
      })
      .finally(() => {
        setIsPoemsLoaded(true);
      });
  }, []);

  // Detect mobile layout.
  useEffect(() => {
    const media = window.matchMedia(MOBILE_QUERY);

    const updateLayout = () => setIsMobile(media.matches);

    updateLayout();
    media.addEventListener("change", updateLayout);

    return () => media.removeEventListener("change", updateLayout);
  }, []);

  const previousPage = useCallback(() => {
    bookRef.current?.pageFlip().flipPrev();
  }, []);

  const nextPage = useCallback(() => {
    bookRef.current?.pageFlip().flipNext();
  }, []);

  const pages = useMemo<ReactElement[]>(() => {
    // MOBILE: unchanged. Single pages: front cover, poem pages, back cover.
    if (isMobile) {
      return [
        <BookPage
          key="front-cover"
          pageNumber={0}
          poemName="Innocent Writer"
          cover="front"
        />,
        ...poems.map((poem, index) => (
          <BookPage
            key={`poem-${poem.id}`}
            pageNumber={index + 1}
            poemName={poem.title}
            image={poem.poemImage || poem.coverImage}
          />
        )),
        <BookPage
          key="back-cover"
          pageNumber={poems.length + 1}
          poemName="The End"
          cover="back"
        />,
      ];
    }

    // DESKTOP: two-page spreads.
    // Spread 1: Writer image (left) | front cover (right)
    // Spread N: poem cover image (left) | poem image (right)
    // Last:     ornament page (left) | back cover (right)
    return [
      <FullImagePage
        key="writer"
        side="left"
        image={WRITER_IMAGE}
        alt="Innocent Writer"
        eager
      />,
      <BookPage
        key="front-cover"
        pageNumber={0}
        poemName="Innocent Writer"
        cover="front"
      />,
      ...poems.flatMap((poem, index) => [
        poem.coverImage ? (
          <FullImagePage
            key={`poem-cover-${poem.id}`}
            side="left"
            image={poem.coverImage}
            alt={`${poem.title} cover`}
            eager={index < 2}
          />
        ) : (
          <TitlePage key={`poem-title-${poem.id}`} title={poem.title} />
        ),
        <BookPage
          key={`poem-${poem.id}`}
          pageNumber={index + 1}
          poemName={poem.title}
          image={poem.poemImage}
          side="right"
        />,
      ]),
      // <OrnamentPage key="closing" />,
      <BookPage
        key="back-cover"
        pageNumber={poems.length + 1}
        poemName="The End"
        cover="back"
      />,
      <FullImagePage
        key="writer"
        side="right"
        image={WRITER_IMAGE}
        alt="Innocent Writer"
        eager
      />,
    ];
  }, [isMobile, poems]);

  return (
    <>
      <SEO
        title="Poetry Book | Innocent Writer"
        description="Explore poetry artwork in an interactive, page-turning book."
        path="/app/book"
      />

      <main
        data-product="gateway"
        id="poetry-book-outer"
        className="poetry-desk flex min-h-[80vh]! w-full flex-1 flex-col items-center justify-center overflow-hidden"
      >
        <section
          aria-label="Poetry book"
          className="flex min-h-0 w-full min-w-0 flex-1 flex-col items-center justify-center"
        >
          <div className="gateway-book flex min-h-0 w-full max-w-[1440px] flex-1 flex-col">
            <div className="relative flex min-h-0 w-full bg-info  flex-1 items-center justify-center overflow-hidden rounded-[3px] bg-[var(--gateway-page)] [&_.stf__wrapper]:!mx-auto [&_.stf__block]:!mx-auto [&_.stf__item]:!overflow-hidden">
              {isPoemsLoaded && (
                <HTMLFlipBook
                  key={isMobile ? "portrait" : "spread"}
                  ref={bookRef}
                  width={620}
                  height={620}
                  size="stretch"
                  minWidth={260}
                  maxWidth={1000}
                  minHeight={340}
                  maxHeight={1000}
                  startPage={0}
                  startZIndex={0}
                  drawShadow
                  flippingTime={750}
                  usePortrait={isMobile}
                  autoSize
                  maxShadowOpacity={0.22}
                  showCover={false}
                  onChangeState={(event) =>
                    setIsFlipping(event.data !== "read")
                  }
                  mobileScrollSupport
                  clickEventForward
                  useMouseEvents
                  swipeDistance={25}
                  showPageCorners
                  disableFlipByClick={false}
                  className="gateway-flip-engine"
                  style={{ margin: "0 auto" }}
                >
                  {pages}
                </HTMLFlipBook>
              )}

              {!isMobile && !isFlipping && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-0 left-1/2 top-0 z-[5] w-[clamp(10px,1.5vw,20px)] -translate-x-1/2 bg-[linear-gradient(90deg,transparent,var(--gateway-page-shade)_30%,var(--gateway-page-line)_50%,var(--gateway-page-shade)_70%,transparent)]"
                />
              )}
            </div>
          </div>
        </section>
        <nav
          aria-label="Book page controls"
          className="pointer-events-none  mt-2 w-full  z-20 flex justify-center gap-2"
        >
          <button
            type="button"
            onClick={previousPage}
            aria-label="Previous page"
            className="pointer-events-auto inline-flex min-h-[31px] items-center justify-center gap-1.5 rounded border border-[var(--gateway-cover-edge)] bg-[var(--gateway-cover)] px-2 py-1.5 text-[11px] font-semibold text-[var(--gateway-page)] shadow-sm transition hover:brightness-110 md:min-h-[34px] md:px-3 md:py-2 md:text-xs"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            {/* Previous */}
          </button>

          <button
            type="button"
            onClick={nextPage}
            aria-label="Next page"
            className="pointer-events-auto inline-flex min-h-[31px] items-center justify-center gap-1.5 rounded border border-[var(--gateway-cover-edge)] bg-[var(--gateway-cover)] px-2 py-1.5 text-[11px] font-semibold text-[var(--gateway-page)] shadow-sm transition hover:brightness-110 md:min-h-[34px] md:px-3 md:py-2 md:text-xs"
          >
            {/* Next */}
            <ArrowRight size={14} aria-hidden="true" />
          </button>
        </nav>
      </main>
    </>
  );
}

export default PoetryBookPage;