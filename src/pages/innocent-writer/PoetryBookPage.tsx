import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
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
};

type FlipBookHandle = {
  pageFlip: () => {
    flipPrev: () => void;
    flipNext: () => void;
  };
};

const COVER_IMAGE = "/images/BookCover.png";

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

const BookPage = forwardRef<HTMLDivElement, BookPageProps>(
  function BookPage({ pageNumber, poemName, image, cover }, ref) {
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
                {isFront
                  ? "A quiet world of words"
                  : "Until we meet again"}
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

    return (
      <div
        ref={ref}
        className={`gateway-page relative isolate box-border flex h-full w-full min-w-0 flex-col overflow-hidden p-3 text-[var(--gateway-text)] sm:p-4 ${
          pageNumber % 2 === 0
            ? "gateway-page--left"
            : "gateway-page--right"
        }`}
        style={PAPER_STYLE}
      >
        <header className="flex min-h-[28px] w-full flex-none items-center justify-between gap-2 border-b border-[var(--gateway-border)] px-0.5 pb-2 font-serif text-[clamp(9px,1vw,12px)]">
          <span className="shrink-0 font-semibold">
            Innocent Writer
          </span>

          <span className="min-w-0 max-w-[60%] truncate text-right">
            {poemName}
          </span>
        </header>

        <div className="flex min-h-0 min-w-0 flex-1 items-center justify-center overflow-hidden px-1 py-2 sm:px-2 sm:py-3">
          {image && (
            <img
              src={image}
              alt={`${poemName}, page ${pageNumber}`}
              className="block h-full max-h-full w-full max-w-full select-none object-contain object-center"
              draggable={false}
              loading={pageNumber <= 2 ? "eager" : "lazy"}
            />
          )}
        </div>

        <footer className="flex min-h-[22px] w-full flex-none items-center justify-center border-t border-[var(--gateway-border)] pt-1 font-serif text-[11px] text-[var(--gateway-text-muted)]">
          {pageNumber}
        </footer>
      </div>
    );
  },
);

BookPage.displayName = "BookPage";

export function PoetryBookPage() {
  const bookRef = useRef<FlipBookHandle | null>(null);

  const [isMobile, setIsMobile] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isPoemsLoaded, setIsPoemsLoaded] = useState(false);

  const [artworks, setArtworks] = useState<
    { pageNumber: number; image: string; poemName: string }[]
  >([]);

  // Load poems before mounting the flipbook.
  useEffect(() => {
    getPoetryBookPoems()
      .then((poems) => {
        setArtworks(
          poems.map((poem, index) => ({
            pageNumber: index + 1,
            image: poem.poemImageUrl || poem.coverImageUrl || "",
            poemName: poem.title,
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
    const media = window.matchMedia("(max-width: 767px)");

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
        className="poetry-desk flex min-h-[calc(100svh-64px)] w-full flex-col items-center overflow-x-hidden p-2 sm:p-3 md:p-4"
      >
        <section
          aria-label="Poetry book"
          className="flex min-h-0 w-full min-w-0 flex-1 flex-col items-center justify-center"
        >
          <div className="gateway-book flex min-h-0 w-full max-w-[1440px] flex-1 flex-col">
            <div className="relative flex min-h-0 w-full flex-1 items-center justify-center overflow-hidden rounded-[3px] bg-[var(--gateway-page)] [&_.stf__wrapper]:!mx-auto [&_.stf__block]:!mx-auto [&_.stf__item]:!overflow-hidden">
              {isPoemsLoaded && (
                <HTMLFlipBook
                  ref={bookRef}
                  width={560}
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
                  {/* Front cover */}
                  <BookPage
                    key="front-cover"
                    pageNumber={0}
                    poemName="Innocent Writer"
                    cover="front"
                  />

                  {/* Dynamic poems from the API */}
                  {artworks.map(({ pageNumber, image, poemName }) => (
                    <BookPage
                      key={`poem-${pageNumber}`}
                      pageNumber={pageNumber}
                      poemName={poemName}
                      image={image}
                    />
                  ))}

                  {/* Back cover */}
                  <BookPage
                    key="back-cover"
                    pageNumber={artworks.length + 1}
                    poemName="The End"
                    cover="back"
                  />
                </HTMLFlipBook>
              )}

              {!isMobile && !isFlipping && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-0 left-1/2 top-0 z-[5] w-[clamp(10px,1.5vw,20px)] -translate-x-1/2 bg-[linear-gradient(90deg,transparent,var(--gateway-page-shade)_30%,var(--gateway-page-line)_50%,var(--gateway-page-shade)_70%,transparent)]"
                />
              )}

              <nav
                aria-label="Book page controls"
                className="pointer-events-none absolute bottom-2 left-2 right-2 z-20 flex justify-between gap-2"
              >
                <button
                  type="button"
                  onClick={previousPage}
                  aria-label="Previous page"
                  className="pointer-events-auto inline-flex min-h-[31px] items-center justify-center gap-1.5 rounded border border-[var(--gateway-cover-edge)] bg-[var(--gateway-cover)] px-2 py-1.5 text-[11px] font-semibold text-[var(--gateway-page)] shadow-sm transition hover:brightness-110 md:min-h-[34px] md:px-3 md:py-2 md:text-xs"
                >
                  <ArrowLeft size={14} aria-hidden="true" />
                  Previous
                </button>

                <button
                  type="button"
                  onClick={nextPage}
                  aria-label="Next page"
                  className="pointer-events-auto inline-flex min-h-[31px] items-center justify-center gap-1.5 rounded border border-[var(--gateway-cover-edge)] bg-[var(--gateway-cover)] px-2 py-1.5 text-[11px] font-semibold text-[var(--gateway-page)] shadow-sm transition hover:brightness-110 md:min-h-[34px] md:px-3 md:py-2 md:text-xs"
                >
                  Next
                  <ArrowRight size={14} aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default PoetryBookPage;

// import {
//   forwardRef,
//   lazy,
//   Suspense,
//   useCallback,
//   useEffect,
//   useRef,
//   useState,
// } from "react";
// import HTMLFlipBook from "react-pageflip";
// import { ArrowLeft, ArrowRight, BookOpen, Feather } from "lucide-react";

// import { SEO } from "@/components/shared/SEO";
// import { Skeleton } from "@/components/skeletons";
// import { getPoetryBookPoems } from "@/features/poems/poemApi";

// const BuyMeATeaSection = lazy(
//   () => import("@/features/poems/components/BuyMeATeaSection"),
// );

// type BookPageProps = {
//   pageNumber: number;
//   poemName: string;
//   image?: string;
//   cover?: "front" | "back";
//   teaPage?: boolean;
// };

// type FlipBookHandle = {
//   pageFlip: () => {
//     flipPrev: () => void;
//     flipNext: () => void;
//   };
// };

// const COVER_IMAGE = "/images/BookCover.png";

// const PAPER_STYLE = {
//   backgroundColor: "var(--gateway-page)",
//   backgroundImage: `
//     repeating-linear-gradient(
//       to bottom,
//       transparent 0,
//       transparent 27px,
//       var(--gateway-page-line) 28px
//     )
//   `,
//   backgroundRepeat: "repeat",
//   backgroundSize: "100% 28px",
//   backgroundClip: "padding-box",
//   backfaceVisibility: "hidden" as const,
//   WebkitBackfaceVisibility: "hidden" as const,
// };

// const COVER_STYLE = {
//   backgroundColor: "#17313b",
//   backfaceVisibility: "hidden" as const,
//   WebkitBackfaceVisibility: "hidden" as const,
// };

// const CoverRule = () => (
//   <div
//     aria-hidden="true"
//     className="flex w-full max-w-[220px] items-center gap-3 text-[var(--gateway-cover-highlight)]"
//   >
//     <span className="h-px flex-1 bg-current opacity-80" />
//     <span className="font-serif text-xl leading-none">❦</span>
//     <span className="h-px flex-1 bg-current opacity-80" />
//   </div>
// );

// const BookPage = forwardRef<HTMLDivElement, BookPageProps>(
//   function BookPage(
//     { pageNumber, poemName, image, cover, teaPage },
//     ref,
//   ) {
//     if (teaPage) {
//       return (
//         <div
//           ref={ref}
//           className="gateway-page gateway-page--left relative isolate box-border flex h-full w-full min-w-0 items-center justify-center overflow-hidden p-2 sm:p-3"
//           style={PAPER_STYLE}
//         >
//           <div className="flex h-full min-h-0 w-full min-w-0 items-center justify-center overflow-hidden">
//             <Suspense
//               fallback={<Skeleton className="h-48 w-full rounded-xl" />}
//             >
//               <BuyMeATeaSection />
//             </Suspense>
//           </div>
//         </div>
//       );
//     }

//     if (cover) {
//       const isFront = cover === "front";

//       return (
//         <div
//           ref={ref}
//           className="gateway-page relative isolate box-border flex h-full w-full min-w-0 items-stretch justify-stretch overflow-hidden p-0 text-center"
//           style={COVER_STYLE}
//         >
//           {/* Cover image */}
//           <img
//             src={COVER_IMAGE}
//             alt=""
//             aria-hidden="true"
//             draggable={false}
//             className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover object-center"
//           />

//           {/* Theme-aware classic book tint */}
//           <div
//             aria-hidden="true"
//             className="pointer-events-none absolute inset-0"
//             style={{
//               background: `
//                 linear-gradient(
//                   180deg,
//                   color-mix(in srgb, var(--gateway-cover) 28%, transparent) 0%,
//                   transparent 38%,
//                   color-mix(in srgb, var(--gateway-cover-edge) 78%, transparent) 100%
//                 ),
//                 linear-gradient(
//                   90deg,
//                   color-mix(in srgb, var(--gateway-cover-edge) 30%, transparent),
//                   transparent 20%,
//                   transparent 80%,
//                   color-mix(in srgb, var(--gateway-cover-edge) 25%, transparent)
//                 )
//               `,
//             }}
//           />

//           {/* Antique book frame */}
//           <div
//             aria-hidden="true"
//             className="pointer-events-none absolute inset-[4px] z-[1] rounded-[2px] border border-[#e7c99a]/35 sm:inset-[7px]"
//           />
//           <div
//             aria-hidden="true"
//             className="pointer-events-none absolute inset-[12px] z-[1] border border-[#e7c99a]/80 sm:inset-[16px]"
//           />
//           <div
//             aria-hidden="true"
//             className="pointer-events-none absolute inset-[18px] z-[1] border border-white/25 sm:inset-[23px]"
//           />

//           <div className="relative z-[2] flex h-full min-h-0 w-full flex-col items-center justify-between overflow-hidden px-7 py-8 sm:px-10 sm:py-10 md:px-12 md:py-12">
//             {/* Top ornament */}
//             <div className="flex flex-col items-center gap-3">
//               <span className="font-serif text-[10px] uppercase tracking-[0.25em] text-white/95 sm:text-xs">
//                 {isFront ? "A quiet world of words" : "Until we meet again"}
//               </span>
//               <CoverRule />
//             </div>

//             {/* Short cover message */}
//             <div className="flex w-full flex-col items-center">
//               <div className="mb-4 flex size-12 items-center justify-center rounded-full border border-[#e7c99a]/80 bg-black/20 text-white sm:mb-5 sm:size-14">
//                 {isFront ? (
//                   <BookOpen size={27} strokeWidth={1.15} />
//                 ) : (
//                   <Feather size={26} strokeWidth={1.15} />
//                 )}
//               </div>

//               {isFront ? (
//                 <>
//                   <h1 className="font-serif text-[clamp(32px,5vw,54px)] font-medium leading-tight text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.8)]">
//                     Enter the
//                     <span className="block italic text-amber-200">
//                       Poetry World
//                     </span>
//                   </h1>

//                   <div className="my-5 sm:my-6">
//                     <CoverRule />
//                   </div>

//                   <p className="max-w-[230px] font-serif text-sm italic leading-relaxed text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.8)] sm:text-base">
//                     Turn the page. Let the words speak.
//                   </p>
//                 </>
//               ) : (
//                 <>
//                   <h2 className="font-serif text-[clamp(32px,5vw,50px)] font-medium leading-tight text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.8)]">
//                     The End
//                   </h2>

//                   <div className="my-5 sm:my-6">
//                     <CoverRule />
//                   </div>

//                   <p className="max-w-[230px] font-serif text-sm italic leading-relaxed text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.8)] sm:text-base">
//                     Keep a little poetry with you.
//                   </p>
//                 </>
//               )}
//             </div>

//             {/* Bottom imprint */}
//             <div className="flex flex-col items-center gap-2">
//               <span
//                 className="font-serif text-xl text-amber-200"
//                 aria-hidden="true"
//               >
//                 ✦
//               </span>
//               <p className="font-sans text-[8px] uppercase tracking-[0.28em] text-white/95 sm:text-[9px]">
//                 Innocent Writer
//               </p>
//             </div>
//           </div>
//         </div>
//       );
//     }

//     return (
//       <div
//         ref={ref}
//         className={`gateway-page relative isolate box-border flex h-full w-full min-w-0 flex-col overflow-hidden p-3 text-[var(--gateway-text)] sm:p-4 ${
//           pageNumber % 2 === 0
//             ? "gateway-page--right"
//             : "gateway-page--left"
//         }`}
//         style={PAPER_STYLE}
//       >
//         <header className="flex min-h-[28px] w-full flex-none items-center justify-between gap-2 border-b border-[var(--gateway-border)] px-0.5 pb-2 font-serif text-[clamp(9px,1vw,12px)]">
//           <span className="shrink-0 font-semibold">Innocent Writer</span>
//           <span className="min-w-0 max-w-[60%] truncate text-right">
//             {poemName}
//           </span>
//         </header>

//         <div className="flex min-h-0 min-w-0 flex-1 items-center justify-center overflow-hidden px-1 py-2 sm:px-2 sm:py-3">
//           {image && (
//             <img
//               src={image}
//               alt={`${poemName}, page ${pageNumber}`}
//               className="block h-full max-h-full w-full max-w-full select-none object-contain object-center"
//               draggable={false}
//               loading={pageNumber <= 2 ? "eager" : "lazy"}
//             />
//           )}
//         </div>

//         <footer className="flex min-h-[22px] w-full flex-none items-center justify-center border-t border-[var(--gateway-border)] pt-1 font-serif text-[11px] text-[var(--gateway-text-muted)]">
//           {pageNumber}
//         </footer>
//       </div>
//     );
//   },
// );

// BookPage.displayName = "BookPage";

// export function PoetryBookPage() {
//   const bookRef = useRef<FlipBookHandle | null>(null);
//   const [isMobile, setIsMobile] = useState(false);
//   const [isFlipping, setIsFlipping] = useState(false);
//   const [artworks, setArtworks] = useState<
//     { pageNumber: number; image: string; poemName: string }[]
//   >([]);

//   // Dynamic poems and images from the API
//   useEffect(() => {
//     const controller = new AbortController();

//     getPoetryBookPoems(controller.signal)
//       .then((poems) => {
//         setArtworks(
//           poems.map((poem, index) => ({
//             pageNumber: index + 1,
//             image: poem.poemImageUrl || poem.coverImageUrl || "",
//             poemName: poem.title,
//           })),
//         );
//       })
//       .catch((error) => {
//         if (error.name !== "AbortError") {
//           console.error("Failed to load poetry book poems:", error);
//         }
//       });

//     return () => controller.abort();
//   }, []);

//   useEffect(() => {
//     const media = window.matchMedia("(max-width: 767px)");
//     const updateLayout = () => setIsMobile(media.matches);

//     updateLayout();
//     media.addEventListener("change", updateLayout);

//     return () => media.removeEventListener("change", updateLayout);
//   }, []);

//   const previousPage = useCallback(() => {
//     bookRef.current?.pageFlip().flipPrev();
//   }, []);

//   const nextPage = useCallback(() => {
//     bookRef.current?.pageFlip().flipNext();
//   }, []);

//   return (
//     <>
//       <SEO
//         title="Poetry Book | Innocent Writer"
//         description="Explore poetry artwork in an interactive, page-turning book."
//         path="/app/book"
//       />

//       <main
//         data-product="gateway"
//         className="poetry-desk flex min-h-[calc(100svh-64px)] w-full flex-col items-center overflow-x-hidden p-2 sm:p-3 md:p-4"
//       >
//         <section
//           aria-label="Poetry book"
//           className="flex min-h-0 w-full min-w-0 flex-1 flex-col items-center justify-center"
//         >
//           <div className="gateway-book flex min-h-0 w-full max-w-[1440px] flex-1 flex-col">
//             <div className="relative flex min-h-0 w-full flex-1 items-center justify-center overflow-hidden rounded-[3px] bg-[var(--gateway-page)] [&_.stf__wrapper]:!mx-auto [&_.stf__block]:!mx-auto [&_.stf__item]:!overflow-hidden">
//               <HTMLFlipBook
//                 ref={bookRef}
//                 width={560}
//                 height={620}
//                 size="stretch"
//                 minWidth={260}
//                 maxWidth={1000}
//                 minHeight={340}
//                 maxHeight={1000}
//                 startPage={isMobile ? 1 : 0}
//                 startZIndex={0}
//                 drawShadow
//                 flippingTime={750}
//                 usePortrait={isMobile}
//                 autoSize
//                 maxShadowOpacity={0.22}
//                 showCover={false}
//                 onChangeState={(event) =>
//                   setIsFlipping(event.data !== "read")
//                 }
//                 mobileScrollSupport
//                 clickEventForward
//                 useMouseEvents
//                 swipeDistance={25}
//                 showPageCorners
//                 disableFlipByClick={false}
//                 className="gateway-flip-engine"
//                 style={{ margin: "0 auto" }}
//               >
//                 <BookPage
//                   key="tea-page"
//                   pageNumber={0}
//                   poemName="Support the Writer"
//                   teaPage
//                 />

//                 <BookPage
//                   key="front-cover"
//                   pageNumber={0}
//                   poemName="Innocent Writer"
//                   cover="front"
//                 />

//                 {artworks.map(({ pageNumber, image, poemName }) => (
//                   <BookPage
//                     key={`poem-${pageNumber}`}
//                     pageNumber={pageNumber}
//                     poemName={poemName}
//                     image={image}
//                   />
//                 ))}

//                 <BookPage
//                   key="back-cover"
//                   pageNumber={11}
//                   poemName="The End"
//                   cover="back"
//                 />
//               </HTMLFlipBook>

//               {!isMobile && !isFlipping && (
//                 <div
//                   aria-hidden="true"
//                   className="pointer-events-none absolute bottom-0 left-1/2 top-0 z-[5] w-[clamp(10px,1.5vw,20px)] -translate-x-1/2 bg-[linear-gradient(90deg,transparent,var(--gateway-page-shade)_30%,var(--gateway-page-line)_50%,var(--gateway-page-shade)_70%,transparent)]"
//                 />
//               )}

//               <nav
//                 aria-label="Book page controls"
//                 className="pointer-events-none absolute bottom-2 left-2 right-2 z-20 flex justify-between gap-2"
//               >
//                 <button
//                   type="button"
//                   onClick={previousPage}
//                   aria-label="Previous page"
//                   className="pointer-events-auto inline-flex min-h-[31px] items-center justify-center gap-1.5 rounded border border-[var(--gateway-cover-edge)] bg-[var(--gateway-cover)] px-2 py-1.5 text-[11px] font-semibold text-[var(--gateway-page)] shadow-sm transition hover:brightness-110 md:min-h-[34px] md:px-3 md:py-2 md:text-xs"
//                 >
//                   <ArrowLeft size={14} aria-hidden="true" />
//                   Previous
//                 </button>

//                 <button
//                   type="button"
//                   onClick={nextPage}
//                   aria-label="Next page"
//                   className="pointer-events-auto inline-flex min-h-[31px] items-center justify-center gap-1.5 rounded border border-[var(--gateway-cover-edge)] bg-[var(--gateway-cover)] px-2 py-1.5 text-[11px] font-semibold text-[var(--gateway-page)] shadow-sm transition hover:brightness-110 md:min-h-[34px] md:px-3 md:py-2 md:text-xs"
//                 >
//                   Next
//                   <ArrowRight size={14} aria-hidden="true" />
//                 </button>
//               </nav>
//             </div>
//           </div>
//         </section>

//         {isMobile && (
//           <section
//             aria-label="Support Innocent Writer"
//             className="mt-3 w-full max-w-md shrink-0"
//           >
//             <Suspense
//               fallback={<Skeleton className="h-48 w-full rounded-xl" />}
//             >
//               <BuyMeATeaSection />
//             </Suspense>
//           </section>
//         )}
//       </main>
//     </>
//   );
// }

// export default PoetryBookPage;












// import {
//   forwardRef,
//   lazy,
//   Suspense,
//   useCallback,
//   useEffect,
//   useRef,
//   useState,
// } from "react";
// import HTMLFlipBook from "react-pageflip";
// import { ArrowLeft, ArrowRight, BookOpen, Feather } from "lucide-react";

// import { SEO } from "@/components/shared/SEO";
// import { Skeleton } from "@/components/skeletons";

// const BuyMeATeaSection = lazy(
//   () => import("@/features/poems/components/BuyMeATeaSection"),
// );

// type BookPageProps = {
//   pageNumber: number;
//   poemName: string;
//   image?: string;
//   cover?: "front" | "back";
//   teaPage?: boolean;
// };

// type FlipBookHandle = {
//   pageFlip: () => {
//     flipPrev: () => void;
//     flipNext: () => void;
//   };
// };

// const COVER_IMAGE = "/images/BookCover.png";

// const ARTWORKS = Array.from({ length: 10 }, (_, index) => ({
//   pageNumber: index + 1,
//   image: [
//     "/images/Writer.jpg",
//     "/images/Ganesh.jpg",
//     "/images/Ganesh.jpg",
//     "/images/Writer.jpg",
//   ][index % 4],
//   poemName: `Poem ${index + 1}`,
// }));

// const PAPER_STYLE = {
//   backgroundColor: "var(--gateway-page)",
//   backgroundImage: `
//     repeating-linear-gradient(
//       to bottom,
//       transparent 0,
//       transparent 27px,
//       var(--gateway-page-line) 28px
//     )
//   `,
//   backgroundRepeat: "repeat",
//   backgroundSize: "100% 28px",
//   backgroundClip: "padding-box",
//   backfaceVisibility: "hidden" as const,
//   WebkitBackfaceVisibility: "hidden" as const,
// };

// const COVER_STYLE = {
//   backgroundColor: "#17313b",
//   backfaceVisibility: "hidden" as const,
//   WebkitBackfaceVisibility: "hidden" as const,
// };

// const CoverRule = () => (
//   <div
//     aria-hidden="true"
//     className="flex w-full max-w-[220px] items-center gap-3 text-[var(--gateway-cover-highlight)]"
//   >
//     <span className="h-px flex-1 bg-current opacity-80" />
//     <span className="font-serif text-xl leading-none">❦</span>
//     <span className="h-px flex-1 bg-current opacity-80" />
//   </div>
// );

// const BookPage = forwardRef<HTMLDivElement, BookPageProps>(
//   function BookPage(
//     { pageNumber, poemName, image, cover, teaPage },
//     ref,
//   ) {
//     if (teaPage) {
//       return (
//         <div
//           ref={ref}
//           className="gateway-page gateway-page--left relative isolate box-border flex h-full w-full min-w-0 items-center justify-center overflow-hidden p-2 sm:p-3"
//           style={PAPER_STYLE}
//         >
//           <div className="flex h-full min-h-0 w-full min-w-0 items-center justify-center overflow-hidden">
//             <Suspense fallback={<Skeleton className="h-48 w-full rounded-xl" />}>
//               <BuyMeATeaSection />
//             </Suspense>
//           </div>
//         </div>
//       );
//     }

//     if (cover) {
//       const isFront = cover === "front";

//       return (
//         <div
//           ref={ref}
//           className="gateway-page relative isolate box-border flex h-full w-full min-w-0 items-stretch justify-stretch overflow-hidden p-0 text-center"
//           style={COVER_STYLE}
//         >
//           {/* Cover image */}
//           <img
//             src={COVER_IMAGE}
//             alt=""
//             aria-hidden="true"
//             draggable={false}
//             className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover object-center"
//           />

//           {/* Theme-aware classic book tint */}
//           <div
//             aria-hidden="true"
//             className="pointer-events-none absolute inset-0"
//             style={{
//               background: `
//                 linear-gradient(
//                   180deg,
//                   color-mix(in srgb, var(--gateway-cover) 28%, transparent) 0%,
//                   transparent 38%,
//                   color-mix(in srgb, var(--gateway-cover-edge) 78%, transparent) 100%
//                 ),
//                 linear-gradient(
//                   90deg,
//                   color-mix(in srgb, var(--gateway-cover-edge) 30%, transparent),
//                   transparent 20%,
//                   transparent 80%,
//                   color-mix(in srgb, var(--gateway-cover-edge) 25%, transparent)
//                 )
//               `,
//             }}
//           />

//           {/* Antique book frame */}
//           <div
//             aria-hidden="true"
//             className="pointer-events-none absolute inset-[4px] z-[1] rounded-[2px] border border-[#e7c99a]/35 sm:inset-[7px]"
//           />
//           <div
//             aria-hidden="true"
//             className="pointer-events-none absolute inset-[12px] z-[1] border border-[#e7c99a]/80 sm:inset-[16px]"
//           />
//           <div
//             aria-hidden="true"
//             className="pointer-events-none absolute inset-[18px] z-[1] border border-white/25 sm:inset-[23px]"
//           />

//           <div className="relative z-[2] flex h-full min-h-0 w-full flex-col items-center justify-between overflow-hidden px-7 py-8 sm:px-10 sm:py-10 md:px-12 md:py-12">
//             {/* Top ornament */}
//             <div className="flex flex-col items-center gap-3">
//               <span className="font-serif text-[10px] uppercase tracking-[0.25em] text-white/95 sm:text-xs">
//                 {isFront ? "A quiet world of words" : "Until we meet again"}
//               </span>
//               <CoverRule />
//             </div>

//             {/* Short cover message */}
//             <div className="flex w-full flex-col items-center">
//               <div className="mb-4 flex size-12 items-center justify-center rounded-full border border-[#e7c99a]/80 bg-black/20 text-white sm:mb-5 sm:size-14">
//                 {isFront ? (
//                   <BookOpen size={27} strokeWidth={1.15} />
//                 ) : (
//                   <Feather size={26} strokeWidth={1.15} />
//                 )}
//               </div>

//               {isFront ? (
//                 <>
//                   <h1 className="font-serif text-[clamp(32px,5vw,54px)] font-medium leading-tight text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.8)]">
//                     Enter the
//                     <span className="block italic text-amber-200">
//                       Poetry World
//                     </span>
//                   </h1>

//                   <div className="my-5 sm:my-6">
//                     <CoverRule />
//                   </div>

//                   <p className="max-w-[230px] font-serif text-sm italic leading-relaxed text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.8)] sm:text-base">
//                     Turn the page. Let the words speak.
//                   </p>
//                 </>
//               ) : (
//                 <>
//                   <h2 className="font-serif text-[clamp(32px,5vw,50px)] font-medium leading-tight text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.8)]">
//                     The End
//                   </h2>

//                   <div className="my-5 sm:my-6">
//                     <CoverRule />
//                   </div>

//                   <p className="max-w-[230px] font-serif text-sm italic leading-relaxed text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.8)] sm:text-base">
//                     Keep a little poetry with you.
//                   </p>
//                 </>
//               )}
//             </div>

//             {/* Bottom imprint */}
//             <div className="flex flex-col items-center gap-2">
//               <span
//                 className="font-serif text-xl text-amber-200"
//                 aria-hidden="true"
//               >
//                 ✦
//               </span>
//               <p className="font-sans text-[8px] uppercase tracking-[0.28em] text-white/95 sm:text-[9px]">
//                 Innocent Writer
//               </p>
//             </div>
//           </div>
//         </div>
//       );
//     }

//     return (
//       <div
//         ref={ref}
//         className={`gateway-page relative isolate box-border flex h-full w-full min-w-0 flex-col overflow-hidden p-3 text-[var(--gateway-text)] sm:p-4 ${
//           pageNumber % 2 === 0
//             ? "gateway-page--right"
//             : "gateway-page--left"
//         }`}
//         style={PAPER_STYLE}
//       >
//         <header className="flex min-h-[28px] w-full flex-none items-center justify-between gap-2 border-b border-[var(--gateway-border)] px-0.5 pb-2 font-serif text-[clamp(9px,1vw,12px)]">
//           <span className="shrink-0 font-semibold">Innocent Writer</span>
//           <span className="min-w-0 max-w-[60%] truncate text-right">
//             {poemName}
//           </span>
//         </header>

//         <div className="flex min-h-0 min-w-0 flex-1 items-center justify-center overflow-hidden px-1 py-2 sm:px-2 sm:py-3">
//           {image && (
//             <img
//               src={image}
//               alt={`${poemName}, page ${pageNumber}`}
//               className="block h-full max-h-full w-full max-w-full select-none object-contain object-center"
//               draggable={false}
//               loading={pageNumber <= 2 ? "eager" : "lazy"}
//             />
//           )}
//         </div>

//         <footer className="flex min-h-[22px] w-full flex-none items-center justify-center border-t border-[var(--gateway-border)] pt-1 font-serif text-[11px] text-[var(--gateway-text-muted)]">
//           {pageNumber}
//         </footer>
//       </div>
//     );
//   },
// );

// BookPage.displayName = "BookPage";

// export function PoetryBookPage() {
//   const bookRef = useRef<FlipBookHandle | null>(null);
//   const [isMobile, setIsMobile] = useState(false);
//   const [isFlipping, setIsFlipping] = useState(false);

//   useEffect(() => {
//     const media = window.matchMedia("(max-width: 767px)");
//     const updateLayout = () => setIsMobile(media.matches);

//     updateLayout();
//     media.addEventListener("change", updateLayout);

//     return () => media.removeEventListener("change", updateLayout);
//   }, []);

//   const previousPage = useCallback(() => {
//     bookRef.current?.pageFlip().flipPrev();
//   }, []);

//   const nextPage = useCallback(() => {
//     bookRef.current?.pageFlip().flipNext();
//   }, []);

//   return (
//     <>
//       <SEO
//         title="Poetry Book | Innocent Writer"
//         description="Explore poetry artwork in an interactive, page-turning book."
//         path="/app/book"
//       />

//       <main
//         data-product="gateway"
//         className="poetry-desk flex min-h-[calc(100svh-64px)] w-full flex-col items-center overflow-x-hidden p-2 sm:p-3 md:p-4"
//       >
//         <section
//           aria-label="Poetry book"
//           className="flex min-h-0 w-full min-w-0 flex-1 flex-col items-center justify-center"
//         >
//           <div className="gateway-book flex min-h-0 w-full max-w-[1440px] flex-1 flex-col">
//             <div className="relative flex min-h-0 w-full flex-1 items-center justify-center overflow-hidden rounded-[3px] bg-[var(--gateway-page)] [&_.stf__wrapper]:!mx-auto [&_.stf__block]:!mx-auto [&_.stf__item]:!overflow-hidden">
//               <HTMLFlipBook
//                 ref={bookRef}
//                 width={560}
//                 height={620}
//                 size="stretch"
//                 minWidth={260}
//                 maxWidth={1000}
//                 minHeight={340}
//                 maxHeight={1000}
//                 startPage={isMobile ? 1 : 0}
//                 startZIndex={0}
//                 drawShadow
//                 flippingTime={750}
//                 usePortrait={isMobile}
//                 autoSize
//                 maxShadowOpacity={0.22}
//                 showCover={false}
//                 onChangeState={(event) =>
//                   setIsFlipping(event.data !== "read")
//                 }
//                 mobileScrollSupport
//                 clickEventForward
//                 useMouseEvents
//                 swipeDistance={25}
//                 showPageCorners
//                 disableFlipByClick={false}
//                 className="gateway-flip-engine"
//                 style={{ margin: "0 auto" }}
//               >
//                 <BookPage
//                   key="tea-page"
//                   pageNumber={0}
//                   poemName="Support the Writer"
//                   teaPage
//                 />

//                 <BookPage
//                   key="front-cover"
//                   pageNumber={0}
//                   poemName="Innocent Writer"
//                   cover="front"
//                 />

//                 {ARTWORKS.map(({ pageNumber, image, poemName }) => (
//                   <BookPage
//                     key={`poem-${pageNumber}`}
//                     pageNumber={pageNumber}
//                     poemName={poemName}
//                     image={image}
//                   />
//                 ))}

//                 <BookPage
//                   key="back-cover"
//                   pageNumber={11}
//                   poemName="The End"
//                   cover="back"
//                 />
//               </HTMLFlipBook>

//               {!isMobile && !isFlipping && (
//                 <div
//                   aria-hidden="true"
//                   className="pointer-events-none absolute bottom-0 left-1/2 top-0 z-[5] w-[clamp(10px,1.5vw,20px)] -translate-x-1/2 bg-[linear-gradient(90deg,transparent,var(--gateway-page-shade)_30%,var(--gateway-page-line)_50%,var(--gateway-page-shade)_70%,transparent)]"
//                 />
//               )}

//               <nav
//                 aria-label="Book page controls"
//                 className="pointer-events-none absolute bottom-2 left-2 right-2 z-20 flex justify-between gap-2"
//               >
//                 <button
//                   type="button"
//                   onClick={previousPage}
//                   aria-label="Previous page"
//                   className="pointer-events-auto inline-flex min-h-[31px] items-center justify-center gap-1.5 rounded border border-[var(--gateway-cover-edge)] bg-[var(--gateway-cover)] px-2 py-1.5 text-[11px] font-semibold text-[var(--gateway-page)] shadow-sm transition hover:brightness-110 md:min-h-[34px] md:px-3 md:py-2 md:text-xs"
//                 >
//                   <ArrowLeft size={14} aria-hidden="true" />
//                   Previous
//                 </button>

//                 <button
//                   type="button"
//                   onClick={nextPage}
//                   aria-label="Next page"
//                   className="pointer-events-auto inline-flex min-h-[31px] items-center justify-center gap-1.5 rounded border border-[var(--gateway-cover-edge)] bg-[var(--gateway-cover)] px-2 py-1.5 text-[11px] font-semibold text-[var(--gateway-page)] shadow-sm transition hover:brightness-110 md:min-h-[34px] md:px-3 md:py-2 md:text-xs"
//                 >
//                   Next
//                   <ArrowRight size={14} aria-hidden="true" />
//                 </button>
//               </nav>
//             </div>
//           </div>
//         </section>

//         {isMobile && (
//           <section
//             aria-label="Support Innocent Writer"
//             className="mt-3 w-full max-w-md shrink-0"
//           >
//             <Suspense fallback={<Skeleton className="h-48 w-full rounded-xl" />}>
//               <BuyMeATeaSection />
//             </Suspense>
//           </section>
//         )}
//       </main>
//     </>
//   );
// }

// export default PoetryBookPage;