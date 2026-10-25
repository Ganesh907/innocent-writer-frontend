import { useState, type FormEvent, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  CalendarDays,
  Eye,
  Feather,
  Heart,
  ImagePlus,
  MessageCircle,
  Pencil,
  Plus,
  Save,
  Sparkles,
  Trash2,
  X,
  Link2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageFilePreview, ImageWithSkeleton } from "@/components/skeletons";
import { useAuth } from "@/features/auth/authContext";
import { getAuthorAnalytics } from "@/features/analytics/analyticsApi";
import {
  createPoem,
  deletePoem,
  getPoems,
  uploadPoemImage,
  updatePoem,
} from "@/features/poems/poemApi";
import { poemQueryKeys } from "@/features/poems/poemQueryKeys";
import type {
  CreatePoemRequest,
  Poem,
  UpdatePoemRequest,
} from "@/contracts/poem";
import { getApiErrorMessage } from "@/lib/api/apiError";

const PAGE_SIZE = 100;
const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp";

interface PoemForm {
  title: string;
  content: string;
  instagramPostUrl: string;
  coverImageFile: File | null;
  poemImageFile: File | null;
}

const EMPTY_FORM: PoemForm = {
  title: "",
  content: "",
  instagramPostUrl: "",
  coverImageFile: null,
  poemImageFile: null,
};

export function AuthorDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState<PoemForm>(EMPTY_FORM);
  const [editingPoem, setEditingPoem] = useState<Poem | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const authorId = user?.id ?? "";
  const listParams = { page: 1, limit: PAGE_SIZE, authorId };

  const poemsQuery = useQuery({
    queryKey: poemQueryKeys.list(listParams),
    queryFn: () => getPoems(listParams),
    enabled: Boolean(authorId),
  });

  const analyticsQuery = useQuery({
    queryKey: poemQueryKeys.authorAnalytics(authorId),
    queryFn: ({ signal }) => getAuthorAnalytics(authorId, signal),
    enabled: Boolean(authorId),
  });

  const poems = poemsQuery.data?.data ?? [];
  const analytics = analyticsQuery.data;

  const createMutation = useMutation({
    mutationFn: (payload: CreatePoemRequest) => createPoem(payload),
    onSuccess: async () => {
      resetForm();
      await refreshData();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdatePoemRequest }) =>
      updatePoem(id, payload),
    onSuccess: async () => {
      resetForm();
      await refreshData();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deletePoem(id),
    onSuccess: refreshData,
  });

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const mutationError = deleteMutation.isError
    ? getApiErrorMessage(deleteMutation.error)
    : null;

  async function refreshData() {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: poemQueryKeys.all }),
      queryClient.invalidateQueries({
        queryKey: poemQueryKeys.authorAnalytics(authorId),
      }),
    ]);
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingPoem(null);
    setFormError(null);
    createMutation.reset();
    updateMutation.reset();
  }

  function updateField<K extends keyof PoemForm>(key: K, value: PoemForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function startEditing(poem: Poem) {
    setEditingPoem(poem);
    setForm({
      title: poem.title,
      content: poem.content,
      instagramPostUrl: poem.instagramPostUrl ?? "",
      coverImageFile: null,
      poemImageFile: null,
    });
    setFormError(null);
    createMutation.reset();
    updateMutation.reset();

    document.getElementById("author-poem-title")?.focus();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    if (!form.title.trim() || !form.content.trim()) {
      setFormError("Title and poem content are required.");
      return;
    }

    if (!editingPoem && (!form.coverImageFile || !form.poemImageFile)) {
      setFormError(
        "Select both a cover image and a poem image to create a poem.",
      );
      return;
    }

    try {
      const coverImage = form.coverImageFile
        ? await uploadPoemImage(form.coverImageFile)
        : undefined;

      const poemImage = form.poemImageFile
        ? await uploadPoemImage(form.poemImageFile)
        : undefined;

      const instagramPostUrl = form.instagramPostUrl.trim() || null;

      if (editingPoem) {
        const payload: UpdatePoemRequest = {
          title: form.title.trim(),
          content: form.content.trim(),
          instagramPostUrl,
          ...(coverImage ? { coverImage } : {}),
          ...(poemImage ? { poemImage } : {}),
        };

        await updateMutation.mutateAsync({
          id: editingPoem.id,
          payload,
        });
      } else {
        const payload: CreatePoemRequest = {
          title: form.title.trim(),
          content: form.content.trim(),
          coverImage: coverImage!,
          poemImage: poemImage!,
          instagramPostUrl,
        };

        await createMutation.mutateAsync(payload);
      }
    } catch (error) {
      setFormError(getApiErrorMessage(error));
    }
  }

  async function handleDelete(poem: Poem) {
    if (!window.confirm(`Delete "${poem.title}"? This cannot be undone.`)) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(poem.id);
    } catch {
      // The error is displayed below the collection.
    }
  }

  return (
    <main
      data-product="poetry"
      className="min-h-screen w-full bg-background text-foreground"
    >
      <div className="mx-auto w-full max-w-[1500px]">
        {/* Book cover and pages */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-x-3 bottom-[-7px] top-3 rounded-[1.5rem] border border-border bg-muted/70 shadow-md" />
          <div className="pointer-events-none absolute inset-x-1.5 bottom-[-4px] top-1.5 rounded-[1.5rem] border border-border bg-card shadow-md" />

          <div className="relative overflow-hidden rounded-[1.5rem] border border-border bg-card shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* LEFT PAGE — POEM EDITOR */}
              <section
                id="author-poem-form"
                className="relative min-w-0 border-b border-border px-5 py-7 sm:px-8 sm:py-8 lg:border-b-0 lg:border-r lg:px-10 lg:py-8"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 right-0 hidden w-5 bg-gradient-to-l from-muted/60 to-transparent lg:block"
                />

                <header className="mb-6 flex items-center gap-3">
                  <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    {editingPoem ? (
                      <Pencil className="size-5" />
                    ) : (
                      <Plus className="size-5" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h1 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
                      {editingPoem ? "Edit your poem" : "Create a poem"}
                    </h1>
                    <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                      Words, feelings and artwork.
                    </p>
                  </div>

                  {editingPoem && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={resetForm}
                      disabled={isSaving}
                      aria-label="Cancel editing"
                    >
                      <X className="size-4" />
                    </Button>
                  )}
                </header>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="author-poem-title">Poem title</Label>
                    <Input
                      id="author-poem-title"
                      value={form.title}
                      onChange={(event) =>
                        updateField("title", event.target.value)
                      }
                      maxLength={200}
                      required
                      placeholder="Give your poem a name..."
                      className="h-10 border-border bg-background font-serif placeholder:italic"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <Label htmlFor="author-poem-content">Poem content</Label>
                      <span className="text-[10px] tabular-nums text-muted-foreground">
                        {form.content.length.toLocaleString()} / 100,000
                      </span>
                    </div>

                    <textarea
                      id="author-poem-content"
                      value={form.content}
                      onChange={(event) =>
                        updateField("content", event.target.value)
                      }
                      rows={8}
                      maxLength={100000}
                      required
                      placeholder={
                        "Write your poem here...\n\nKeep each line where it belongs."
                      }
                      className="min-h-48 w-full resize-y rounded-xl border border-border bg-background px-4 py-3 font-serif text-sm leading-[2rem] text-foreground outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(to bottom, transparent 0, transparent calc(2rem - 1px), hsl(var(--border) / 0.7) calc(2rem - 1px), hsl(var(--border) / 0.7) 2rem)",
                        backgroundPosition: "0 0.5rem",
                      }}
                    />

                    <p className="text-[10px] text-muted-foreground">
                      Line breaks are preserved when readers open your poem.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="author-instagram-url">
                      Instagram URL{" "}
                      <span className="font-normal text-muted-foreground">
                        (optional)
                      </span>
                    </Label>
                    <div className="relative">
                      <Link2 className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="author-instagram-url"
                        type="url"
                        value={form.instagramPostUrl}
                        onChange={(event) =>
                          updateField("instagramPostUrl", event.target.value)
                        }
                        placeholder="https://www.instagram.com/p/..."
                        className="h-10 border-border bg-background pl-9 font-serif placeholder:italic"
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {(
                      [
                        [
                          "coverImageFile",
                          "Cover image",
                          editingPoem?.coverImageUrl,
                        ],
                        [
                          "poemImageFile",
                          "Poem image",
                          editingPoem?.poemImageUrl,
                        ],
                      ] as const
                    ).map(([field, label, existingUrl]) => (
                      <div
                        key={field}
                        className="min-w-0 rounded-xl border border-dashed border-border bg-background/70 p-3"
                      >
                        <div className="flex items-center gap-2">
                          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                            <ImagePlus className="size-4" />
                          </span>
                          <div className="min-w-0">
                            <Label htmlFor={`author-${field}`}>{label}</Label>
                            <p className="mt-0.5 text-[10px] text-muted-foreground">
                              JPEG, PNG or WebP
                            </p>
                          </div>
                        </div>

                        <ImageFilePreview
                          file={form[field]}
                          existingUrl={existingUrl}
                          alt={`${form[field] ? "Selected" : "Current"} ${label.toLowerCase()}`}
                          wrapperClassName="mt-3 h-20 w-full rounded-lg border border-border"
                          className="h-full w-full object-cover"
                        />

                        {form[field] && (
                          <p className="mt-2 truncate text-[10px] text-muted-foreground">
                            Selected: {form[field]?.name}
                          </p>
                        )}

                        <Input
                          id={`author-${field}`}
                          type="file"
                          accept={IMAGE_ACCEPT}
                          onChange={(event) =>
                            updateField(field, event.target.files?.[0] ?? null)
                          }
                          className="mt-3 h-auto min-h-9 cursor-pointer bg-card py-1.5 text-xs file:mr-2 file:rounded-md file:border-0 file:bg-primary/10 file:px-2 file:py-1 file:text-xs file:font-medium file:text-primary"
                        />

                        {existingUrl && (
                          <p className="mt-1 text-[10px] text-muted-foreground">
                            Existing image stays unless replaced.
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  {formError && (
                    <p
                      role="alert"
                      className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive"
                    >
                      {formError}
                    </p>
                  )}

                  {(createMutation.isError || updateMutation.isError) && (
                    <p role="alert" className="text-xs text-destructive">
                      {getApiErrorMessage(
                        createMutation.error ?? updateMutation.error,
                      )}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-3 border-t border-border pt-5">
                    <Button
                      type="submit"
                      disabled={isSaving}
                      className="min-h-10 rounded-full px-6 shadow-md"
                    >
                      {isSaving ? (
                        <span className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
                      ) : editingPoem ? (
                        <Save className="size-4" />
                      ) : (
                        <Sparkles className="size-4" />
                      )}
                      {isSaving
                        ? "Saving..."
                        : editingPoem
                          ? "Save changes"
                          : "Publish poem"}
                    </Button>

                    {editingPoem && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={resetForm}
                        disabled={isSaving}
                        className="rounded-full"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>

                <div className="mt-8 flex items-center justify-between font-serif text-xs text-muted-foreground/70">
                  <span>1</span>
                  <span className="italic">Write from the heart</span>
                </div>
              </section>

              {/* RIGHT PAGE — WELCOME, ANALYTICS AND POEMS */}
              <section className="relative min-w-0 px-5 py-7 sm:px-8 sm:py-8 lg:px-10">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute right-8 top-0 h-16 w-7 bg-primary"
                  style={{
                    clipPath:
                      "polygon(0 0, 100% 0, 100% 100%, 50% 78%, 0 100%)",
                  }}
                />

                <header className="mb-6 pr-8">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                    Your creative space
                  </p>
                  <h2 className="mt-1 font-serif text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                    Every feeling deserves a page.
                  </h2>
                  <p className="mt-2 max-w-lg text-xs leading-5 text-muted-foreground sm:text-sm">
                    Welcome back, {user?.name ?? "writer"}. Create something
                    new, revisit your poems, and share the words that matter.
                  </p>
                </header>

                {/* Compact analytics */}
                <div className="mb-7">
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    <Metric
                      icon={<BookOpen />}
                      label="Poems"
                      value={analytics?.poems ?? 0}
                      loading={analyticsQuery.isPending}
                    />
                    <Metric
                      icon={<Eye />}
                      label="Views"
                      value={analytics?.views ?? 0}
                      loading={analyticsQuery.isPending}
                    />
                    <Metric
                      icon={<Heart />}
                      label="Likes"
                      value={analytics?.likes ?? 0}
                      loading={analyticsQuery.isPending}
                    />
                    <Metric
                      icon={<MessageCircle />}
                      label="Comments"
                      value={analytics?.comments ?? 0}
                      loading={analyticsQuery.isPending}
                    />
                  </div>

                  {analyticsQuery.isError && (
                    <p className="mt-2 text-[10px] text-muted-foreground">
                      Analytics are temporarily unavailable.
                    </p>
                  )}
                </div>

                {/* Poem collection */}
                <section className="min-w-0">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h2 className="font-serif text-xl font-semibold">
                      Your poems
                    </h2>

                    {!poemsQuery.isPending && !poemsQuery.isError && (
                      <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-medium text-primary">
                        {poems.length} {poems.length === 1 ? "poem" : "poems"}
                      </span>
                    )}
                  </div>

                  {poemsQuery.isPending && (
                    <div
                      className="grid gap-3"
                      aria-label="Loading your poems"
                      aria-busy="true"
                    >
                      {[0, 1, 2].map((item) => (
                        <div
                          key={item}
                          className="h-28 animate-pulse rounded-xl border border-border bg-muted/50"
                        />
                      ))}
                    </div>
                  )}

                  {poemsQuery.isError && (
                    <div className="rounded-xl border border-border p-4">
                      <p role="alert" className="text-sm text-destructive">
                        Could not load your poems:{" "}
                        {getApiErrorMessage(poemsQuery.error)}
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => void poemsQuery.refetch()}
                        disabled={poemsQuery.isFetching}
                        className="mt-3"
                      >
                        Try again
                      </Button>
                    </div>
                  )}

                  {!poemsQuery.isPending &&
                    !poemsQuery.isError &&
                    poems.length === 0 && (
                      <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed border-border px-5 py-8 text-center">
                        <div className="mb-3 grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                          <Feather className="size-5" />
                        </div>
                        <h3 className="font-serif text-lg font-semibold">
                          A blank page awaits
                        </h3>
                        <p className="mt-1 max-w-xs text-xs leading-5 text-muted-foreground">
                          Your collection starts with one poem. Write something
                          worth remembering.
                        </p>
                        <Button
                          type="button"
                          size="sm"
                          className="mt-4 rounded-full"
                          onClick={() =>
                            document
                              .getElementById("author-poem-title")
                              ?.focus()
                          }
                        >
                          <Plus className="size-4" />
                          Start writing
                        </Button>
                      </div>
                    )}

                  {poems.length > 0 && (
                    <div className="grid content-start gap-3">
                      {poems.map((poem) => (
                        <Card
                          key={poem.id}
                          className="overflow-hidden rounded-xl border-border bg-background py-0 shadow-sm transition-shadow hover:shadow-md"
                        >
                          <CardContent className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
                            {poem.coverImageUrl ? (
                              <ImageWithSkeleton
                                src={poem.coverImageUrl}
                                alt=""
                                loading="lazy"
                                decoding="async"
                                wrapperClassName="size-16 shrink-0 rounded-xl border border-border"
                                className="size-full object-cover"
                              />
                            ) : (
                              <div className="grid size-16 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                                <Feather className="size-6" />
                              </div>
                            )}

                            <div className="min-w-0 flex-1">
                              <h3 className="break-words font-serif text-base font-semibold leading-snug">
                                {poem.title}
                              </h3>

                              <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-muted-foreground">
                                <span
                                  className={
                                    poem.published
                                      ? "font-medium text-primary"
                                      : "font-medium text-muted-foreground"
                                  }
                                >
                                  {poem.published ? "● Published" : "● Draft"}
                                </span>
                                <span className="inline-flex items-center gap-1">
                                  <CalendarDays className="size-3" />
                                  {new Date(poem.createdAt).toLocaleDateString(
                                    undefined,
                                    {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    },
                                  )}
                                </span>
                              </div>

                              <p className="mt-1.5 line-clamp-2 whitespace-pre-wrap break-words font-serif text-xs italic leading-5 text-muted-foreground">
                                {poem.content}
                              </p>
                            </div>

                            <div className="flex shrink-0 flex-wrap items-center gap-1.5 border-t border-border pt-2 sm:border-t-0 sm:pt-0">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-8 rounded-full px-2.5 text-xs"
                                onClick={() =>
                                  navigate(
                                    `/app/poems/${encodeURIComponent(poem.id)}`,
                                  )
                                }
                              >
                                <Eye className="size-3.5" />
                                View
                              </Button>

                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-8 rounded-full px-2.5 text-xs"
                                onClick={() => startEditing(poem)}
                                disabled={isSaving}
                              >
                                <Pencil className="size-3.5" />
                                Edit
                              </Button>

                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="size-8 rounded-full"
                                aria-label={`Delete ${poem.title}`}
                                disabled={deleteMutation.isPending}
                                onClick={() => void handleDelete(poem)}
                              >
                                {deleteMutation.isPending &&
                                deleteMutation.variables === poem.id ? (
                                  <span className="size-3.5 animate-spin rounded-full border-2 border-current border-r-transparent" />
                                ) : (
                                  <Trash2 className="size-3.5" />
                                )}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  {mutationError && (
                    <p
                      role="alert"
                      className="mt-3 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive"
                    >
                      Delete failed: {mutationError}
                    </p>
                  )}
                </section>

                <div className="mt-8 flex items-center justify-between font-serif text-xs text-muted-foreground/70">
                  <span className="italic">Every poem tells a story</span>
                  <span>2</span>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function Metric({
  icon,
  label,
  value,
  loading,
}: {
  icon: ReactNode;
  label: string;
  value: number;
  loading: boolean;
}) {
  return (
    <Card className="min-w-0 rounded-xl border-border bg-background py-0 shadow-none">
      <CardContent className="flex min-w-0 items-start justify-between gap-1.5 p-3">
        <div className="min-w-0">
          <p className="truncate text-[10px] text-muted-foreground">{label}</p>
          {loading ? (
            <div className="mt-2 h-6 w-9 animate-pulse rounded bg-muted" />
          ) : (
            <p className="mt-1 font-serif text-2xl font-semibold leading-none tabular-nums">
              {value.toLocaleString()}
            </p>
          )}
        </div>
        <span className="shrink-0 text-primary [&_svg]:size-3.5">{icon}</span>
      </CardContent>
    </Card>
  );
}
