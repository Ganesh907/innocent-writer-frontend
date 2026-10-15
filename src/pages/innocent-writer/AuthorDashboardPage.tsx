import { useState, type FormEvent, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
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
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/features/auth/authContext";
import { getAuthorAnalytics } from "@/features/analytics/analyticsApi";
import {
  createPoem,
  deletePoem,
  getPoems,
  imageFileToDataUri,
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
  const listParams = {
    page: 1,
    limit: PAGE_SIZE,
    authorId,
  };

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

  async function refreshData() {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: poemQueryKeys.all,
      }),
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

    window.scrollTo({ top: 0, behavior: "smooth" });
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
        ? await imageFileToDataUri(form.coverImageFile)
        : undefined;

      const poemImage = form.poemImageFile
        ? await imageFileToDataUri(form.poemImageFile)
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
      // The error is displayed below the poem list.
    }
  }

  const analytics = analyticsQuery.data;
  const mutationError = deleteMutation.isError
    ? getApiErrorMessage(deleteMutation.error)
    : null;

  return (
    <main
      data-product="poetry"
      className="author-workspace space-y-6 py-4 sm:py-6"
    >
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
            <Feather aria-hidden="true" className="size-5" />
          </span>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-primary sm:text-xs">
              Innocent Writer · Author workspace
            </p>

            <h1 className="mt-1 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
              Your writing desk
            </h1>

            <p className="mt-2 text-xs leading-5 text-muted-foreground sm:text-sm">
              Welcome, {user?.name ?? "writer"}. Keep your words organised and
              follow how readers connect with them.
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/app/poems")}
          className="self-start sm:self-auto"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Browse poems
        </Button>
      </header>

      <section
        aria-label="Your poetry analytics"
        className="grid grid-cols-2 gap-3 xl:grid-cols-4"
      >
        <Metric
          icon={<BookOpen />}
          label="Your poems"
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
      </section>

      {analyticsQuery.isError && (
        <p role="status" className="text-xs text-muted-foreground">
          Analytics are temporarily unavailable. Your poem management tools
          remain available.
        </p>
      )}

      <section id="author-poem-form" className="space-y-3">
        <div className="flex items-start gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
            {editingPoem ? (
              <Pencil aria-hidden="true" className="size-4" />
            ) : (
              <Plus aria-hidden="true" className="size-4" />
            )}
          </span>

          <div>
            <h2 className="font-serif text-2xl font-semibold">
              {editingPoem ? "Edit your poem" : "Create a poem"}
            </h2>

            <p className="mt-1 text-xs leading-5 text-muted-foreground sm:text-sm">
              Give your words a title, preserve the line breaks, and add your
              artwork.
            </p>
          </div>
        </div>

        <Card className="overflow-hidden rounded-xl border-border/80 bg-card shadow-sm">
          <CardContent className="p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="author-poem-title">Poem title</Label>

                <Input
                  id="author-poem-title"
                  value={form.title}
                  onChange={(event) => updateField("title", event.target.value)}
                  maxLength={200}
                  required
                  placeholder="Give your poem a name…"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="author-poem-content">Poem content</Label>
                  <span className="text-[10px] text-muted-foreground">
                    {form.content.length.toLocaleString()} / 100,000
                  </span>
                </div>

                <textarea
                  id="author-poem-content"
                  value={form.content}
                  onChange={(event) =>
                    updateField("content", event.target.value)
                  }
                  rows={10}
                  maxLength={100000}
                  required
                  placeholder={
                    "Write your poem here…\n\nKeep each line where it belongs."
                  }
                  className="w-full resize-y rounded-lg border border-input bg-background px-3 py-3 font-serif text-sm leading-7 outline-none transition-colors placeholder:font-sans placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-ring"
                />

                <p className="text-[11px] leading-5 text-muted-foreground">
                  Line breaks are preserved when readers open your poem.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="author-instagram-url">
                  Instagram post URL
                  <span className="ml-1 font-normal text-muted-foreground">
                    (optional)
                  </span>
                </Label>

                <Input
                  id="author-instagram-url"
                  type="url"
                  value={form.instagramPostUrl}
                  onChange={(event) =>
                    updateField("instagramPostUrl", event.target.value)
                  }
                  placeholder="https://www.instagram.com/p/…"
                  className="h-11"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {(
                  [
                    [
                      "coverImageFile",
                      "Cover image",
                      editingPoem?.coverImageUrl,
                    ],
                    ["poemImageFile", "Poem image", editingPoem?.poemImageUrl],
                  ] as const
                ).map(([field, label, existingUrl]) => (
                  <div
                    key={field}
                    className="min-w-0 space-y-3 rounded-xl border border-border/80 bg-muted/20 p-3 sm:p-4"
                  >
                    <div className="flex items-center gap-2">
                      <ImagePlus
                        aria-hidden="true"
                        className="size-4 text-primary"
                      />
                      <Label htmlFor={`author-${field}`}>{label}</Label>
                    </div>

                    {existingUrl && !form[field] && (
                      <img
                        src={existingUrl}
                        alt={`Current ${label.toLowerCase()}`}
                        loading="lazy"
                        className="h-32 w-full rounded-lg border border-border/60 object-cover"
                      />
                    )}

                    {form[field] && (
                      <p className="break-all text-xs text-muted-foreground">
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
                      className="h-auto min-h-10 cursor-pointer py-2 text-xs file:mr-3 file:rounded-md file:border-0 file:bg-primary/10 file:px-2 file:py-1 file:text-xs file:font-medium file:text-primary"
                    />

                    <p className="text-[10px] leading-4 text-muted-foreground">
                      JPEG, PNG, or WebP · Maximum 5 MB
                      {existingUrl
                        ? ". Existing image is retained unless replaced."
                        : ""}
                    </p>
                  </div>
                ))}
              </div>

              {formError && (
                <p
                  role="alert"
                  className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive"
                >
                  {formError}
                </p>
              )}

              {(createMutation.isError || updateMutation.isError) && (
                <p role="alert" className="text-sm text-destructive">
                  {getApiErrorMessage(
                    createMutation.error ?? updateMutation.error,
                  )}
                </p>
              )}

              <div className="flex flex-wrap gap-2 border-t border-border/70 pt-4">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <span className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
                  ) : editingPoem ? (
                    <Save aria-hidden="true" className="size-4" />
                  ) : (
                    <Sparkles aria-hidden="true" className="size-4" />
                  )}

                  {isSaving
                    ? "Saving…"
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
                  >
                    <X aria-hidden="true" className="size-4" />
                    Cancel edit
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border/70 pb-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
              Your collection
            </p>

            <h2 className="mt-1 font-serif text-2xl font-semibold">
              Your poems
            </h2>
          </div>

          {!poemsQuery.isPending && !poemsQuery.isError && (
            <span className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
              {poems.length} {poems.length === 1 ? "poem" : "poems"}
            </span>
          )}
        </div>

        {poemsQuery.isPending && (
          <div
            className="grid gap-3 sm:grid-cols-2"
            aria-label="Loading your poems"
            aria-busy="true"
          >
            {[0, 1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-48 animate-pulse rounded-xl border border-border bg-muted/40"
              />
            ))}
          </div>
        )}

        {poemsQuery.isError && (
          <Card className="rounded-xl border-border/80">
            <CardContent className="space-y-3 p-5">
              <p role="alert" className="text-sm text-destructive">
                Could not load your poems:{" "}
                {getApiErrorMessage(poemsQuery.error)}
              </p>

              <Button
                type="button"
                variant="outline"
                onClick={() => void poemsQuery.refetch()}
                disabled={poemsQuery.isFetching}
              >
                Try again
              </Button>
            </CardContent>
          </Card>
        )}

        {!poemsQuery.isPending && !poemsQuery.isError && poems.length === 0 && (
          <Card className="rounded-xl border-dashed border-border bg-card">
            <CardContent className="flex flex-col items-center gap-3 px-5 py-10 text-center sm:py-14">
              <span className="grid size-12 place-items-center rounded-full bg-primary/10 text-primary">
                <Feather aria-hidden="true" className="size-5" />
              </span>

              <h3 className="font-serif text-xl font-semibold">
                Your first page starts here
              </h3>

              <p className="max-w-sm text-sm leading-6 text-muted-foreground">
                Create a poem above to begin building your collection.
              </p>

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  document.getElementById("author-poem-form")?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  })
                }
              >
                <Plus aria-hidden="true" className="size-4" />
                Write a poem
              </Button>
            </CardContent>
          </Card>
        )}

        {poems.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2">
            {poems.map((poem) => (
              <Card
                key={poem.id}
                className="overflow-hidden rounded-xl border-border/80 bg-card py-0 shadow-sm transition-shadow hover:shadow-md"
              >
                <CardContent className="flex h-full flex-col gap-3 p-4 sm:p-5">
                  <div className="flex items-start gap-3">
                    {poem.coverImageUrl ? (
                      <img
                        src={poem.coverImageUrl}
                        alt=""
                        loading="lazy"
                        className="size-16 shrink-0 rounded-lg border border-border/60 object-cover sm:size-20"
                      />
                    ) : (
                      <span className="grid size-16 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary sm:size-20">
                        <Feather aria-hidden="true" className="size-6" />
                      </span>
                    )}

                    <div className="min-w-0 flex-1">
                      <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/50 px-2 py-0.5 text-[9px] font-medium text-muted-foreground">
                        <CalendarDays aria-hidden="true" className="size-3" />
                        {new Date(poem.createdAt).toLocaleDateString(
                          undefined,
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </span>

                      <h3 className="mt-2 break-words font-serif text-lg font-semibold leading-snug">
                        {poem.title}
                      </h3>

                      <p className="mt-1 text-[10px] text-muted-foreground">
                        {poem.published ? "Published" : "Draft"}
                      </p>
                    </div>
                  </div>

                  <p className="line-clamp-3 whitespace-pre-wrap break-words text-sm leading-6 text-muted-foreground">
                    {poem.content}
                  </p>

                  <div className="mt-auto flex flex-wrap gap-2 border-t border-border/70 pt-3">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        navigate(`/app/poems/${encodeURIComponent(poem.id)}`)
                      }
                    >
                      <Eye aria-hidden="true" className="size-3.5" />
                      View
                    </Button>

                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => startEditing(poem)}
                      disabled={isSaving}
                    >
                      <Pencil aria-hidden="true" className="size-3.5" />
                      Edit
                    </Button>

                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="ml-auto"
                      disabled={deleteMutation.isPending}
                      onClick={() => void handleDelete(poem)}
                    >
                      <Trash2 aria-hidden="true" className="size-3.5" />
                      {deleteMutation.isPending &&
                      deleteMutation.variables === poem.id
                        ? "Deleting…"
                        : "Delete"}
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
            className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive"
          >
            Delete failed: {mutationError}
          </p>
        )}
      </section>
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
    <Card className="rounded-xl border-border/80 bg-card shadow-sm">
      <CardContent className="flex min-w-0 items-center gap-3 p-3 sm:gap-4 sm:p-4">
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary sm:size-10">
          {icon}
        </span>

        <div className="min-w-0">
          <p className="truncate text-[10px] text-muted-foreground sm:text-xs">
            {label}
          </p>

          {loading ? (
            <div className="mt-1 h-6 w-12 animate-pulse rounded bg-muted" />
          ) : (
            <p className="mt-0.5 text-xl font-semibold tabular-nums sm:text-2xl">
              {value.toLocaleString()}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
