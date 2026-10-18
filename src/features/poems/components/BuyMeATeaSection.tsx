import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import { Check, Copy, Coffee, ExternalLink, QrCode, Heart } from "lucide-react";



export default function BuyMeATeaSection() {
  const [amount, setAmount] = useState(10);
  const [customAmount, setCustomAmount] = useState("10");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [qrError, setQrError] = useState("");
  const [copied, setCopied] = useState(false);
  const PAYEE_NAME = "Ganesh";
  const AMOUNTS = [10, 50, 100];
  const gpayId = import.meta.env.VITE_UPI_ID;
  const UPI_ID = gpayId;

  const finalAmount = customAmount.trim() ? Number(customAmount) : amount;

  const validAmount =
    Number.isFinite(finalAmount) &&
    finalAmount >= 1 &&
    finalAmount <= 100000 &&
    /^\d+(\.\d{1,2})?$/.test(String(finalAmount));

  const upiUrl = useMemo(() => {
    const params = new URLSearchParams({
      pa: UPI_ID,
      pn: PAYEE_NAME,
      am: validAmount ? finalAmount.toFixed(2) : "21.00",
      cu: "INR",
      tn: "Support Innocent Writer",
    });

    return `upi://pay?${params.toString()}`;
  }, [finalAmount, validAmount]);

  useEffect(() => {
    let cancelled = false;

    async function generateQR() {
      try {
        const url = await QRCode.toDataURL(upiUrl, {
          width: 180,
          margin: 2,
          errorCorrectionLevel: "M",
          color: {
            dark: "#302018",
            light: "#ffffff",
          },
        });

        if (!cancelled) {
          setQrDataUrl(url);
          setQrError("");
        }
      } catch {
        if (!cancelled) {
          setQrDataUrl("");
          setQrError("QR unavailable");
        }
      }
    }

    generateQR();

    return () => {
      cancelled = true;
    };
  }, [upiUrl]);

  async function copyUpiId() {
    try {
      await navigator.clipboard.writeText(UPI_ID);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <aside
      aria-label="Support Innocent Writer"
      className="mx-auto w-full min-w-0 max-w-xl font-serif text-[#30251e]"
    >
      <div className="overflow-hidden rounded-xl border border-[#d8c7ad] bg-[#fbf6ec] shadow-sm">
        {/* Compact heading */}
        <header className="flex items-center gap-3 border-b border-[#e6d9c5] px-3 py-3 sm:px-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[#d8c7ad] bg-[#f1e5d1] text-[#68482f]">
            <Coffee size={20} aria-hidden="true" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="font-sans text-[9px] uppercase tracking-[0.2em] text-[#88745d]">
              A little support, a lot of heart
            </p>
            <h2 className="text-lg font-semibold leading-tight sm:text-xl">
              Buy Me a Tea
            </h2>
          </div>

          <Heart
            size={18}
            className="shrink-0 text-[#a16b48]"
            aria-hidden="true"
          />
        </header>

        <div className="grid min-w-0 grid-cols-1 gap-3 p-3 sm:p-4 md:grid-cols-[1fr_0.9fr] md:gap-4">
          {/* Marathi message */}
          <section className="flex min-w-0 flex-col">
            <div className="rounded-lg border border-[#e6d9c5] bg-[#f5ecdc] px-3 py-3 text-center">
              <span
                aria-hidden="true"
                className="mb-2 block text-xl leading-none text-[#a16b48]"
              >
                ❝
              </span>

              <p className="text-sm leading-7 text-[#48372a] sm:text-base">
                'Coffee' च्या दुनियेतील 'Modern' लोकांमध्ये राहणारा,
                <br />
                जुन्या विचारांचा, एक अस्सल 'चहाप्रेमी'
              </p>

              <span
                aria-hidden="true"
                className="mt-2 block text-xl leading-none text-[#a16b48]"
              >
                ❞
              </span>
            </div>

            <p className="mt-2 text-center text-xs leading-relaxed text-[#806d59] md:text-left">
              If a line stayed with you, leave a little warmth for the words yet
              to come.
            </p>

            {/* QR: compact on mobile and desktop */}
            <div className="mt-3 flex items-center gap-3 rounded-lg border border-[#e6d9c5] bg-white p-2.5 md:mt-auto md:pt-3">
              <div className="flex size-[88px] shrink-0 items-center justify-center rounded-md border border-[#eee4d5] bg-white p-1">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt={`UPI payment QR code for ₹${
                      validAmount ? finalAmount.toFixed(2) : "21.00"
                    }`}
                    width={80}
                    height={80}
                    className="block size-full object-contain"
                  />
                ) : (
                  <div
                    className="flex flex-col items-center gap-1 text-center text-[#6c5a48]"
                    role={qrError ? "status" : undefined}
                  >
                    <QrCode size={23} aria-hidden="true" />
                    <span className="text-[9px]">
                      {qrError || "Generating…"}
                    </span>
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-xs font-semibold">
                  <QrCode size={14} aria-hidden="true" />
                  Scan &amp; Pay
                </p>
                <p className="mt-1 text-[10px] leading-relaxed text-[#806d59]">
                  Scan with your UPI app. Verify the recipient and amount before
                  approving.
                </p>
              </div>
            </div>
          </section>

          {/* Payment controls */}
          <section className="flex min-w-0 flex-col">
            <p className="mb-2 font-sans text-[9px] font-semibold uppercase tracking-[0.16em] text-[#88745d]">
              Choose your offering
            </p>

            <div className="grid grid-cols-3 gap-2">
              {AMOUNTS.map((value) => {
                const selected = !customAmount && amount === value;

                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      setAmount(value);
                      setCustomAmount("");
                    }}
                    aria-pressed={selected}
                    className={`min-h-9 rounded-md border px-2 py-2 font-sans text-xs font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8a6545] ${
                      selected
                        ? "border-[#5c3c28] bg-[#5c3c28] text-[#fff8ec]"
                        : "border-[#d8c7ad] bg-white text-[#48372a] hover:bg-[#f5ecdc]"
                    }`}
                  >
                    ₹{value}
                  </button>
                );
              })}
            </div>
{/* 
            <label htmlFor="tea-custom-amount" className="sr-only">
              Custom amount in rupees
            </label> */}

            {/* <input
              id="tea-custom-amount"
              type="number"
              min="1"
              max="100000"
              step="0.01"
              inputMode="decimal"
              placeholder="Custom amount (₹)"
              value={customAmount}
              onChange={(event) => setCustomAmount(event.target.value)}
              className="mt-2 min-h-9 w-full min-w-0 rounded-md border border-[#d8c7ad] bg-white px-3 py-2 font-sans text-xs text-[#30251e] outline-none placeholder:text-[#9b8872] focus:border-[#8a6545] focus:ring-1 focus:ring-[#8a6545]"
            /> */}

            {/* {!validAmount && (
              <p role="alert" className="mt-1 text-[10px] text-red-700">
                Enter an amount between ₹1 and ₹1,00,000.
              </p>
            )} */}

            {/* Recipient and copy */}
            <div className="mt-3 flex min-w-0 items-center gap-2 rounded-lg border border-[#e6d9c5] bg-[#f5ecdc] p-2.5">
              <div className="min-w-0 flex-1">
                <p className="font-sans text-[10px] text-[#806d59]">
                  Payee: {PAYEE_NAME}
                </p>
                <p className="break-all font-sans text-xs font-medium text-[#30251e]">
                  {UPI_ID}
                </p>
              </div>

              <button
                type="button"
                onClick={copyUpiId}
                aria-label="Copy UPI ID"
                className="flex size-9 shrink-0 items-center justify-center rounded-md border border-[#d8c7ad] bg-white text-[#5c3c28] transition hover:bg-[#efe1cc] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8a6545]"
              >
                {copied ? (
                  <Check size={15} aria-hidden="true" />
                ) : (
                  <Copy size={15} aria-hidden="true" />
                )}
              </button>
            </div>

            {copied && (
              <p role="status" className="mt-1 text-[10px] text-[#5c6d3a]">
                UPI ID copied
              </p>
            )}

            <a
              href={validAmount ? upiUrl : undefined}
              aria-disabled={!validAmount}
              onClick={(event) => {
                if (!validAmount) event.preventDefault();
              }}
              className={`mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#49392d] px-5 font-sans text-xs font-semibold text-[#fff8eb]! transition hover:bg-[#35291f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8a6545] dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90 ${
                !validAmount ? "pointer-events-none opacity-50" : ""
              }`}
            >
              Offer ₹{validAmount ? finalAmount.toFixed(2) : "—"} via UPI
              <ExternalLink size={13} aria-hidden="true" />
            </a>

            <p className="mt-2 text-center text-[9px] leading-relaxed text-[#88745d]">
              Payment completion is not confirmed by this page.
            </p>
          </section>
        </div>
      </div>
    </aside>
  );
}
