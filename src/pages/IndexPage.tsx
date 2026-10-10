
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

export function IndexPage() {
  const navigate = useNavigate();

  return (
    <main className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <section className="flex min-h-[50svh] flex-col items-center justify-center gap-5 bg-background px-5 py-16 text-center text-foreground sm:gap-6 sm:px-8 lg:min-h-screen">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Innocent Writer
        </p>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          Product
        </h1>

        <p className="max-w-md text-base text-muted-foreground sm:text-lg">
          Enter the Innocent Writer product experience.
        </p>

        <Button
          size="lg"
          onClick={() => navigate("/app")}
        >
          Open Product
        </Button>
      </section>

      <section className="flex min-h-[50svh] flex-col items-center justify-center gap-5 border-t border-border bg-muted px-5 py-16 text-center text-foreground sm:gap-6 sm:px-8 lg:min-h-screen lg:border-l lg:border-t-0">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Innocent Writer
        </p>

        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          Portfolio
        </h2>

        <p className="max-w-md text-base text-muted-foreground sm:text-lg">
          Explore the portfolio and professional work.
        </p>

        <Button
          size="lg"
          variant="outline"
          onClick={() => navigate("/portfolio")}
        >
          Open Portfolio
        </Button>
      </section>
    </main>
  );
}
