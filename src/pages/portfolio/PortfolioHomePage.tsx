import { useEffect, useState } from "react";

import type { CSSProperties } from "react";

import {
  ArrowDown,
  ArrowDownRight,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  BriefcaseBusiness,
  Check,
  Code2,
  Database,
  ExternalLink,
  FileText,
  GraduationCap,
  Layers3,
  Mail,
  MapPin,
  Menu,
  Phone,
  Server,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  portfolioEducation,
  portfolioExperience,
  portfolioProfile,
  portfolioProjects,
  portfolioSkills,
  skillCategories,
  type PortfolioProject,
  type SkillCategory,
} from "@/features/portfolio/portfolioContent";

import PortfolioCursor from "@/features/portfolio/components/PortfolioCursor";

function SectionHeading({
  eyebrow,

  title,

  description,
}: {
  eyebrow: string;

  title: string;

  description?: string;
}) {
  return (
    <div className="portfolio-section-heading mb-7 max-w-3xl sm:mb-9">
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-primary dark:text-primary sm:text-sm">
        {eyebrow}
      </p>

      <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
        {title}
      </h2>

      {description && (
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:mt-4 sm:text-base">
          {description}
        </p>
      )}
    </div>
  );
}

function ProjectCard({ project }: { project: PortfolioProject }) {
  return (
    <article className="portfolio-card flex h-full min-w-0 flex-col rounded-2xl border border-[var(--color-border-strong)]/20 bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-[0_12px_35px_rgba(0,184,219,0.10)] sm:p-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary dark:text-primary">
          <Code2 aria-hidden="true" className="size-5" />
        </div>

        <span className="max-w-[65%] rounded-full border border-[var(--color-border-strong)]/20 bg-primary/5 px-3 py-1 text-right text-xs font-medium text-primary dark:text-primary">
          {project.category}
        </span>
      </div>

      <h3 className="text-lg font-bold text-card-foreground sm:text-xl">
        {project.name}
      </h3>

      <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
        {project.description}
      </p>

      <div className="mt-5">
        <p className="mb-3 text-sm font-bold text-card-foreground">
          Highlights
        </p>

        <ul className="space-y-2">
          {project.highlights.map((highlight) => (
            <li
              key={highlight}
              className="flex items-start gap-2 text-sm leading-6 text-muted-foreground"
            >
              <Check
                aria-hidden="true"
                className="mt-1 size-4 shrink-0 text-primary dark:text-primary"
              />

              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {project.technologies.map((technology) => (
          <span
            key={technology}
            className="rounded-md border border-[var(--color-border-strong)]/15 bg-primary/5 px-2.5 py-1 text-xs font-medium text-muted-foreground"
          >
            {technology}
          </span>
        ))}
      </div>

      <div className="mt-auto border-t border-border pt-4">
        {project.links.length > 0 ? (
          <div className="flex flex-wrap gap-x-5 gap-y-3">
            {project.links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-[var(--color-primary-hover)] hover:underline dark:text-primary dark:hover:text-[var(--color-primary-hover)]"
              >
                {link.label}

                <ExternalLink aria-hidden="true" className="size-4" />
              </a>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Professional project details are available on request.
          </p>
        )}
      </div>
    </article>
  );
}

export function PortfolioHomePage() {
  const [activeCategory, setActiveCategory] = useState<SkillCategory>("All");

  const [showAllSkills, setShowAllSkills] = useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [emailCopied, setEmailCopied] = useState(false);

  const filteredSkills =
    activeCategory === "All"
      ? portfolioSkills
      : portfolioSkills.filter((skill) => skill.category === activeCategory);

  const visibleSkills = showAllSkills
    ? filteredSkills
    : filteredSkills.slice(0, 12);

  const navigation = [
    { label: "About", href: "#about" },

    { label: "Skills", href: "#skills" },

    { label: "Work", href: "#projects" },

    { label: "Experience", href: "#experience" },

    { label: "Contact", href: "#contact" },
  ];

  useEffect(() => {
    const root = document.getElementById("portfolio-root");

    if (!root) return;

    const elements = root.querySelectorAll<HTMLElement>(".portfolio-reveal");

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));

      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");

            observer.unobserve(entry.target);
          }
        });
      },

      {
        threshold: 0.08,

        rootMargin: "0px 0px -25px 0px",
      },
    );

    elements.forEach((element, index) => {
      element.style.setProperty(
        "--reveal-delay",

        `${(index % 3) * 70}ms`,
      );

      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(portfolioProfile.email);

      setEmailCopied(true);

      window.setTimeout(() => setEmailCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${portfolioProfile.email}`;
    }
  }

  return (
    <main
      id="portfolio-root"
      className="portfolio-page min-h-screen overflow-x-clip bg-background text-foreground"
    >
      <PortfolioCursor />

      {/* Navigation */}

      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/15 bg-slate-950/55 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between gap-2 px-4 sm:gap-4 sm:px-6 lg:px-10">
          <a
            href="#home"
            className="shrink-0 text-base font-extrabold tracking-tight text-white sm:text-xl"
          >
            <span className="text-primary">GANESH</span> SHINDE
          </a>

          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-4 lg:flex xl:gap-6"
          >
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-slate-200 transition-colors hover:text-[var(--color-primary-hover)]"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <Button
              size="sm"
              className="hidden bg-primary font-semibold text-slate-950 hover:bg-[var(--color-primary-hover)] sm:inline-flex"
              render={<a href="/" />}
            >
              Innocent Writer
              <ArrowUpRight aria-hidden="true" />
            </Button>

            <Button
              size="icon"
              variant="outline"
              aria-label={
                mobileMenuOpen ? "Close navigation" : "Open navigation"
              }
              aria-expanded={mobileMenuOpen}
              className="border-white/25 bg-slate-900/80 text-white hover:bg-slate-800 hover:text-[var(--color-primary-hover)] lg:hidden"
              onClick={() => setMobileMenuOpen((open) => !open)}
            >
              {mobileMenuOpen ? (
                <X aria-hidden="true" />
              ) : (
                <Menu aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav
            aria-label="Mobile navigation"
            className="border-t border-white/10 bg-slate-950/95 px-4 py-3 backdrop-blur-xl lg:hidden"
          >
            <div className="mx-auto flex max-w-6xl flex-col gap-1">
              {navigation.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg px-3 py-3 text-sm text-slate-200 transition-colors hover:bg-[var(--color-primary-hover)]/10 hover:text-[var(--color-primary-hover)]"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </nav>
        )}
      </header>

      {/* Hero */}

      <section
        id="home"
        className="relative flex min-h-[100svh] items-center overflow-hidden bg-cover bg-center pt-20 sm:bg-top dark:bg-slate-950"
        style={{
          backgroundImage: "url('/images/PortfolioBg.png')",
        }}
      >
        {/* Dark-mode-only overlays; the original image remains unchanged in light mode */}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden dark:block"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(2,8,14,0.30), rgba(2,8,14,0.05)), linear-gradient(0deg, rgba(2,8,14,0.40), rgba(2,8,14,0.02))",
          }}
        />

        <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-col justify-end gap-6 px-4 py-10 sm:gap-8 sm:px-6 sm:py-12 md:px-8 lg:min-h-[calc(100svh-5rem)] lg:flex-row lg:items-end lg:justify-between lg:gap-10 lg:px-10 xl:gap-12">
          {/* Left introduction */}

          <div className=" relative w-full max-w-[540px]  space-y-4 rounded-2xl border-2 border-white dark:border-primary p-5 text-white shadow-[0_0_30px_rgba(0,184,219,0.12)] backdrop-blur-md transition-colors duration-300 hover:border-white sm:p-7">
            <p
              className="portfolio-fade-up text-xl font-extrabold leading-snug sm:text-3xl"
              style={{ "--intro-delay": "200ms" } as CSSProperties}
            >
              Hi, I'm{" "}
              <span className="portfolio-name-wrap relative inline-block cursor-pointer px-2 py-1">
                <span className="portfolio-name-text relative z-10 inline-block font-bold text-black hover:text-white dark:hover:text-white">
                  {portfolioProfile.name}
                </span>

                <span aria-hidden="true" className="portfolio-name-bg" />
              </span>
            </p>

            <p
              className="portfolio-fade-up text-base font-semibold leading-7 sm:text-xl"
              style={{ "--intro-delay": "400ms" } as CSSProperties}
            >
              <span className="text-teal-400">Programmer</span> by the sun{" "}
              <span
                className="animate-spin duration-500 inline-block text-yellow-400"
                aria-label="sun"
                role="img"
              >
                ☀
              </span>
              {" . "}
              <span className="text-pink-400">Poet</span> by the stars{" "}
              <span
                className="animate-pulse inline-block text-yellow-400"
                aria-label="star"
                role="img"
              >
                ★
              </span>
            </p>

            <p
              className="portfolio-fade-up text-base font-semibold leading-7 sm:text-xl"
              style={{ "--intro-delay": "600ms" } as CSSProperties}
            >
              Merging the{" "}
              <span className="text-teal-400">
                Code{" "}
                <Code2
                  aria-hidden="true"
                  className="animate-pulse inline size-5 text-white/80"
                />
              </span>
              , and writing the{" "}
              <span className="text-pink-400">
                Bars{" "}
                <span
                  aria-hidden="true"
                  className="animate-pulse inline-block text-white/80"
                >
                  ♬
                </span>
              </span>
              {" ..."}
            </p>

            <div
              className="portfolio-fade-up flex flex-wrap gap-3 pt-1"
              style={{ "--intro-delay": "800ms" } as CSSProperties}
            >
              <Button
                size="sm"
                className="bg-primary font-semibold text-slate-950 transition-transform duration-200 hover:scale-105 hover:bg-[var(--color-primary-hover)]"
                render={<a href="#projects" />}
              >
                Explore Work
                <ArrowDownRight aria-hidden="true" />
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="border-white/30 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                render={<a href={`mailto:${portfolioProfile.email}`} />}
              >
                Contact Me
                <ArrowUpRight aria-hidden="true" />
              </Button>
            </div>
          </div>

          {/* Right profile summary */}

          <aside className="portfolio-profile-enter w-full max-w-[420px]  justify-self-start lg:justify-self-end ">
            <div className="rounded-3xl border border-primary/25  bg-card/95 p-5 text-card-foreground shadow-2xl dark:backdrop-blur-xl sm:p-7">
              <div className="mb-5 flex items-center gap-4">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-slate-950">
                  GS
                </div>

                <div className="min-w-0">
                  <h2 className="text-lg font-bold sm:text-xl">
                    {portfolioProfile.name}
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {portfolioProfile.role}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <BriefcaseBusiness
                    aria-hidden="true"
                    className="mt-0.5 size-5 shrink-0 text-primary dark:text-primary"
                  />

                  <div>
                    <p className="text-sm font-semibold">Experience</p>

                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {portfolioProfile.experience}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin
                    aria-hidden="true"
                    className="mt-0.5 size-5 shrink-0 text-primary dark:text-primary"
                  />

                  <div>
                    <p className="text-sm font-semibold">Location</p>

                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {portfolioProfile.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Code2
                    aria-hidden="true"
                    className="mt-0.5 size-5 shrink-0 text-primary dark:text-primary"
                  />

                  <div>
                    <p className="text-sm font-semibold">Core focus</p>

                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      Frontend, backend, and database-driven applications
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 border-t border-border pt-4">
                <p className="text-sm leading-6 text-muted-foreground">
                  Interested in discussing a project or professional
                  opportunity?
                </p>

                <a
                  href={`mailto:${portfolioProfile.email}`}
                  className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-[var(--color-primary-hover)] dark:text-primary dark:hover:text-[var(--color-primary-hover)]"
                >
                  Get in touch
                  <ArrowRight aria-hidden="true" className="size-4" />
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* About */}

      <section
        id="about"
        className="portfolio-section scroll-mt-20 border-t border-primary/10 bg-background"
      >
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="About me"
            title="Building useful, maintainable web applications."
            description="My background spans frontend development, API integration, backend contributions, and relational data workflows."
          />

          <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr] lg:gap-7">
            <div className="portfolio-reveal portfolio-card rounded-2xl border border-[var(--color-border-strong)]/20 bg-card p-5 shadow-sm sm:p-7">
              <p className="text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
                {portfolioProfile.about}
              </p>

              <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
                I value reusable components, clear separation of concerns,
                reliable API integration, and maintainable code. I enjoy
                understanding how the user interface, application logic, and
                database work together to support a complete workflow.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  className="border-[var(--color-border-strong)]/25 bg-primary/5 text-primary hover:bg-[var(--color-primary-hover)]/10 hover:text-[var(--color-primary-hover)] dark:text-primary dark:hover:text-[var(--color-primary-hover)]"
                  render={
                    <a
                      href={portfolioProfile.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                >
                  <Code2 aria-hidden="true" />
                  GitHub profile
                  <ExternalLink aria-hidden="true" />
                </Button>

                <Button
                  variant="outline"
                  className="border-[var(--color-border-strong)]/25 bg-primary/5 text-primary hover:bg-[var(--color-primary-hover)]/10 hover:text-[var(--color-primary-hover)] dark:text-primary dark:hover:text-[var(--color-primary-hover)]"
                  render={<a href={`mailto:${portfolioProfile.email}`} />}
                >
                  <Mail aria-hidden="true" />
                  Email me
                </Button>
              </div>
            </div>

            <div className="grid content-start gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <article className="portfolio-reveal portfolio-card rounded-2xl border border-[var(--color-border-strong)]/20 bg-card p-5 transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
                <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary dark:text-primary">
                  <Code2 aria-hidden="true" className="size-5" />
                </div>

                <h3 className="font-bold text-card-foreground">
                  Frontend development
                </h3>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Responsive interfaces, reusable components, typed React
                  applications, and API-connected user workflows.
                </p>
              </article>

              <article className="portfolio-reveal portfolio-card rounded-2xl border border-[var(--color-border-strong)]/20 bg-card p-5 transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
                <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary dark:text-primary">
                  <Server aria-hidden="true" className="size-5" />
                </div>

                <h3 className="font-bold text-card-foreground">
                  Backend integration
                </h3>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  REST APIs, authentication and authorization workflows, backend
                  contributions, and relational data management.
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* Skills */}

      <section
        id="skills"
        className="portfolio-section scroll-mt-20 border-y border-primary/10 bg-muted/30"
      >
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Technical skills"
            title="Tools and technologies I work with."
            description="Explore technologies grouped by category, including skills listed on my resume and technologies used in Innocent Writer."
          />

          <div
            className="mb-6 flex flex-wrap gap-2"
            aria-label="Filter skills by category"
          >
            {skillCategories.map((category) => (
              <Button
                key={category}
                size="sm"
                variant={activeCategory === category ? "default" : "outline"}
                aria-pressed={activeCategory === category}
                className={
                  activeCategory === category
                    ? "bg-primary text-white hover:bg-[var(--color-primary-hover)] dark:bg-primary dark:text-slate-950 dark:hover:bg-[var(--color-primary-hover)]"
                    : "border-[var(--color-border-strong)]/25 bg-card text-muted-foreground hover:border-primary/60 hover:bg-[var(--color-primary-hover)]/5 hover:text-foreground"
                }
                onClick={() => {
                  setActiveCategory(category);

                  setShowAllSkills(false);
                }}
              >
                {category}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {visibleSkills.map((skill) => (
              <article
                key={`${skill.category}-${skill.name}`}
                className="portfolio-reveal portfolio-card flex min-w-0 items-center gap-3 rounded-xl border border-[var(--color-border-strong)]/15 bg-card p-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md sm:p-4"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary dark:text-primary">
                  {skill.category === "Database" ? (
                    <Database aria-hidden="true" className="size-5" />
                  ) : skill.category === "Backend" ? (
                    <Server aria-hidden="true" className="size-5" />
                  ) : skill.category === "Architecture" ? (
                    <Layers3 aria-hidden="true" className="size-5" />
                  ) : (
                    <Code2 aria-hidden="true" className="size-5" />
                  )}
                </div>

                <div className="min-w-0">
                  <p className="break-words text-sm font-semibold text-card-foreground sm:text-base">
                    {skill.name}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {skill.evidence === "Resume"
                      ? "Resume-listed skill"
                      : "Innocent Writer project"}
                  </p>
                </div>
              </article>
            ))}
          </div>

          {filteredSkills.length > 12 && (
            <div className="mt-6 text-center">
              <Button
                variant="outline"
                className="border-[var(--color-border-strong)]/25 bg-card text-primary hover:bg-[var(--color-primary-hover)]/10 hover:text-[var(--color-primary-hover)] dark:text-primary dark:hover:text-[var(--color-primary-hover)]"
                onClick={() => setShowAllSkills((show) => !show)}
              >
                {showAllSkills ? "Show fewer skills" : "Show all skills"}

                {showAllSkills ? (
                  <ArrowUp aria-hidden="true" />
                ) : (
                  <ArrowDown aria-hidden="true" />
                )}
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Projects */}

      <section
        id="projects"
        className="portfolio-section scroll-mt-20 bg-background"
      >
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Selected work"
            title="Projects and practical experience."
            description="A selection of personal and professional projects, with technologies and responsibilities based on my experience."
          />

          <div className="grid items-stretch gap-4 sm:gap-5 lg:grid-cols-2">
            {portfolioProjects.map((project) => (
              <div key={project.name} className="portfolio-reveal min-w-0">
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience and education */}

      <section
        id="experience"
        className="portfolio-section scroll-mt-20 border-y border-primary/10 bg-muted/30"
      >
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Professional journey"
            title="Experience and education."
            description="My professional journey at BitByBit Solutions and my academic background."
          />

          <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
            <div className="min-w-0">
              <h3 className="mb-5 flex items-center gap-3 text-xl font-bold text-foreground">
                <BriefcaseBusiness
                  aria-hidden="true"
                  className="size-5 text-primary dark:text-primary"
                />
                Work experience
              </h3>

              <div className="relative space-y-4 border-l border-[var(--color-border-strong)]/25 pl-5 sm:pl-6">
                {portfolioExperience.map((experience) => (
                  <article
                    key={`${experience.role}-${experience.period}`}
                    className="portfolio-reveal portfolio-card relative rounded-xl border border-[var(--color-border-strong)]/15 bg-card p-4 transition-all duration-300 hover:border-primary/50 sm:p-5"
                  >
                    <span className="absolute -left-[1.65rem] top-6 size-3 rounded-full border-2 border-[var(--color-border-strong)] bg-background dark:border-primary sm:-left-[1.95rem]" />

                    <p className="text-xs font-semibold text-primary dark:text-primary sm:text-sm">
                      {experience.period}
                    </p>

                    <h4 className="mt-2 text-base font-bold text-card-foreground sm:text-lg">
                      {experience.role}
                    </h4>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {experience.company}
                    </p>

                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      {experience.description}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            <div className="min-w-0">
              <h3 className="mb-5 flex items-center gap-3 text-xl font-bold text-foreground">
                <GraduationCap
                  aria-hidden="true"
                  className="size-5 text-primary dark:text-primary"
                />
                Education
              </h3>

              <div className="space-y-4">
                {portfolioEducation.map((education) => (
                  <article
                    key={`${education.qualification}-${education.institution}`}
                    className="portfolio-reveal portfolio-card rounded-2xl border border-[var(--color-border-strong)]/15 bg-card p-4 transition-all duration-300 hover:border-primary/50 sm:p-5"
                  >
                    <p className="text-xs font-semibold text-primary dark:text-primary sm:text-sm">
                      {education.period}
                    </p>

                    <h4 className="mt-2 text-lg font-bold text-card-foreground">
                      {education.qualification}
                    </h4>

                    <p className="mt-2 text-sm text-muted-foreground">
                      {education.institution}
                    </p>

                    <p className="mt-3 inline-flex rounded-md border border-[var(--color-border-strong)]/15 bg-primary/5 px-2.5 py-1 text-xs font-medium text-primary dark:text-primary">
                      {education.result}
                    </p>
                  </article>
                ))}
              </div>

              <div className="portfolio-reveal portfolio-card mt-4 rounded-2xl border border-[var(--color-border-strong)]/20 bg-card p-5">
                <h4 className="font-bold text-card-foreground">Resume</h4>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  View the complete resume for more details about professional
                  experience, skills, and education.
                </p>

                <a
                  href={portfolioProfile.resumePath}
                  download="Ganesh-Shinde-Resume.pdf"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-[var(--color-primary-hover)] hover:underline dark:text-primary dark:hover:text-[var(--color-primary-hover)]"
                >
                  <FileText aria-hidden="true" className="size-4" />
                  Download resume
                  <ArrowDown aria-hidden="true" className="size-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}

      <section
        id="contact"
        className="portfolio-section scroll-mt-20 bg-background"
      >
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="portfolio-reveal overflow-hidden rounded-3xl border border-[var(--color-border-strong)]/25 bg-card shadow-[0_12px_45px_rgba(0,184,219,0.06)]">
            <div className="grid gap-7 p-5 sm:gap-9 sm:p-8 md:p-10 lg:grid-cols-[1fr_0.9fr] lg:gap-12 lg:p-12">
              <div className="min-w-0">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-primary dark:text-primary sm:text-sm">
                  Contact
                </p>

                <h2 className="text-3xl font-extrabold tracking-tight text-card-foreground sm:text-4xl">
                  Let's discuss your next project.
                </h2>

                <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
                  {portfolioProfile.availabilityNote} You can reach me by email
                  or connect with me through my professional profiles.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Button
                    size="lg"
                    className="bg-primary font-semibold text-white hover:bg-[var(--color-primary-hover)] dark:bg-primary dark:text-slate-950 dark:hover:bg-[var(--color-primary-hover)]"
                    render={<a href={`mailto:${portfolioProfile.email}`} />}
                  >
                    <Mail aria-hidden="true" />
                    Email me
                    <ArrowUpRight aria-hidden="true" />
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    className="border-[var(--color-border-strong)]/25 bg-primary/5 text-primary hover:bg-[var(--color-primary-hover)]/10 hover:text-[var(--color-primary-hover)] dark:text-primary dark:hover:text-[var(--color-primary-hover)]"
                    render={
                      <a
                        href={portfolioProfile.resumePath}
                        download="Ganesh-Shinde-Resume.pdf"
                      />
                    }
                  >
                    <FileText aria-hidden="true" />
                    Resume
                    <ArrowDown aria-hidden="true" />
                  </Button>
                </div>
              </div>

              <div className="min-w-0 space-y-3">
                <a
                  href={`mailto:${portfolioProfile.email}`}
                  className="flex min-w-0 items-center gap-3 rounded-xl border border-[var(--color-border-strong)]/15 bg-primary/[0.03] p-3.5 transition-all hover:border-primary/50 hover:bg-[var(--color-primary-hover)]/5 sm:gap-4 sm:p-4"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary dark:text-primary">
                    <Mail aria-hidden="true" className="size-5" />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-xs text-muted-foreground">
                      Email
                    </span>

                    <span className="mt-1 block break-all text-sm font-medium text-card-foreground">
                      {portfolioProfile.email}
                    </span>
                  </span>

                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-4 shrink-0 text-primary dark:text-primary"
                  />
                </a>

                <a
                  href={`tel:${portfolioProfile.phone.replace(/[^\d+]/g, "")}`}
                  className="flex min-w-0 items-center gap-3 rounded-xl border border-[var(--color-border-strong)]/15 bg-primary/[0.03] p-3.5 transition-all hover:border-primary/50 hover:bg-[var(--color-primary-hover)]/5 sm:gap-4 sm:p-4"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary dark:text-primary">
                    <Phone aria-hidden="true" className="size-5" />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-xs text-muted-foreground">
                      Phone
                    </span>

                    <span className="mt-1 block text-sm font-medium text-card-foreground">
                      {portfolioProfile.phone}
                    </span>
                  </span>

                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-4 shrink-0 text-primary dark:text-primary"
                  />
                </a>

                <a
                  href={portfolioProfile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-w-0 items-center gap-3 rounded-xl border border-[var(--color-border-strong)]/15 bg-primary/[0.03] p-3.5 transition-all hover:border-primary/50 hover:bg-[var(--color-primary-hover)]/5 sm:gap-4 sm:p-4"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary dark:text-primary">
                    <ExternalLink aria-hidden="true" className="size-5" />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-xs text-muted-foreground">
                      LinkedIn
                    </span>

                    <span className="mt-1 block text-sm font-medium text-card-foreground">
                      Professional profile
                    </span>
                  </span>

                  <ExternalLink
                    aria-hidden="true"
                    className="size-4 shrink-0 text-primary dark:text-primary"
                  />
                </a>

                <a
                  href={portfolioProfile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-w-0 items-center gap-3 rounded-xl border border-[var(--color-border-strong)]/15 bg-primary/[0.03] p-3.5 transition-all hover:border-primary/50 hover:bg-[var(--color-primary-hover)]/5 sm:gap-4 sm:p-4"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary dark:text-primary">
                    <Code2 aria-hidden="true" className="size-5" />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-xs text-muted-foreground">
                      GitHub
                    </span>

                    <span className="mt-1 block text-sm font-medium text-card-foreground">
                      Code and repositories
                    </span>
                  </span>

                  <ExternalLink
                    aria-hidden="true"
                    className="size-4 shrink-0 text-primary dark:text-primary"
                  />
                </a>

                <Button
                  variant="outline"
                  className="w-full border-[var(--color-border-strong)]/25 bg-primary/5 text-primary hover:bg-[var(--color-primary-hover)]/10 hover:text-[var(--color-primary-hover)] dark:text-primary dark:hover:text-[var(--color-primary-hover)]"
                  onClick={copyEmail}
                >
                  {emailCopied ? (
                    <Check aria-hidden="true" />
                  ) : (
                    <Mail aria-hidden="true" />
                  )}

                  {emailCopied ? "Email copied" : "Copy email address"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}

      <footer className="border-t border-[var(--color-border-strong)]/15 bg-muted/30">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} {portfolioProfile.name}. All rights
            reserved.
          </p>

          <a
            href="#home"
            className="inline-flex items-center gap-2 font-medium transition-colors hover:text-primary dark:hover:text-[var(--color-primary-hover)]"
          >
            Back to top
            <ArrowUp aria-hidden="true" className="size-4" />
          </a>
        </div>
      </footer>
    </main>
  );
}

export default PortfolioHomePage;