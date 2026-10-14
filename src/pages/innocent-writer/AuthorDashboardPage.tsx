
import { useState, type FormEvent } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Eye,
  Heart,
  MessageCircle,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/features/auth/authContext";
import {
  getAuthorAnalytics,
} from "@/features/analytics/analyticsApi";
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
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdatePoemRequest;
    }) => updatePoem(id, payload),
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
  }

  function updateField<K extends keyof PoemForm>(
    key: K,
    value: PoemForm[K],
  ) {
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    if (!form.title.trim() || !form.content.trim()) {
      setFormError("Title and poem content are required.");
      return;
    }

    if (
      !editingPoem &&
      (!form.coverImageFile || !form.poemImageFile)
    ) {
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

      const instagramPostUrl =
        form.instagramPostUrl.trim() || null;

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
    if (
      !window.confirm(
        `Delete "${poem.title}"? This cannot be undone.`,
      )
    ) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(poem.id);
    } catch {
      // The error is shown below the poem list.
    }
  }

  const analytics = analyticsQuery.data;
  const mutationError = deleteMutation.isError
    ? getApiErrorMessage(deleteMutation.error)
    : null;

  return (
    <main className="space-y-8 py-8 sm:py-12">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Innocent Writer · Author workspace
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Author Dashboard
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Welcome, {user?.name ?? "writer"}. Manage your own poems.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/app/poems")}
        >
          <ArrowLeft aria-hidden="true" />
          Browse poems
        </Button>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric icon={<BookOpen />} label="Your poems" value={analytics?.poems ?? 0} />
        <Metric icon={<Eye />} label="Views" value={analytics?.views ?? 0} />
        <Metric icon={<Heart />} label="Likes" value={analytics?.likes ?? 0} />
        <Metric icon={<MessageCircle />} label="Comments" value={analytics?.comments ?? 0} />
      </section>

      <section id="author-poem-form" className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">
            {editingPoem ? "Edit your poem" : "Create a poem"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            JPEG, PNG or WebP images only, up to 5 MB each.
          </p>
        </div>

        <Card>
          <CardContent className="p-5 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="author-poem-title">Title</Label>
                <Input
                  id="author-poem-title"
                  value={form.title}
                  onChange={(event) => updateField("title", event.target.value)}
                  maxLength={200}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author-poem-content">Poem content</Label>
                <textarea
                  id="author-poem-content"
                  value={form.content}
                  onChange={(event) => updateField("content", event.target.value)}
                  rows={8}
                  maxLength={100000}
                  required
                  className="w-full resize-y rounded-md border border-input bg-transparent px-3 py-3 text-sm leading-6"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author-instagram-url">
                  Instagram post URL (optional)
                </Label>
                <Input
                  id="author-instagram-url"
                  type="url"
                  value={form.instagramPostUrl}
                  onChange={(event) =>
                    updateField("instagramPostUrl", event.target.value)
                  }
                  placeholder="https://www.instagram.com/p/..."
                />
              </div>

              {(
                [
                  ["coverImageFile", "Cover image", editingPoem?.coverImageUrl],
                  ["poemImageFile", "Poem image", editingPoem?.poemImageUrl],
                ] as const
              ).map(([field, label, existingUrl]) => (
                <div key={field} className="space-y-2">
                  <Label htmlFor={`author-${field}`}>{label}</Label>

                  {existingUrl && !form[field] && (
                    <img
                      src={existingUrl}
                      alt={`Current ${label}`}
                      className="h-32 w-full rounded-md object-cover"
                    />
                  )}

                  <Input
                    id={`author-${field}`}
                    type="file"
                    accept={IMAGE_ACCEPT}
                    onChange={(event) =>
                      updateField(field, event.target.files?.[0] ?? null)
                    }
                  />

                  <p className="text-xs text-muted-foreground">
                    {form[field]?.name ??
                      (existingUrl
                        ? "Existing image retained unless replaced."
                        : "Select an image.")}
                  </p>
                </div>
              ))}

              {formError && (
                <p role="alert" className="text-sm text-destructive">
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

              <div className="flex flex-wrap gap-2">
                <Button type="submit" disabled={isSaving}>
                  {editingPoem ? <Pencil /> : <Plus />}
                  {isSaving
                    ? "Saving..."
                    : editingPoem
                      ? "Save changes"
                      : "Publish poem"}
                </Button>

                {editingPoem && (
                  <Button type="button" variant="outline" onClick={resetForm}>
                    <X />
                    Cancel edit
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Your poems</h2>

        {poemsQuery.isPending && <p>Loading your poems...</p>}

        {poemsQuery.isError && (
          <p role="alert" className="text-sm text-destructive">
            Could not load your poems: {getApiErrorMessage(poemsQuery.error)}
          </p>
        )}

        {!poemsQuery.isPending && !poemsQuery.isError && poems.length === 0 && (
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground">
              You have not published any poems yet.
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {poems.map((poem) => (
            <Card key={poem.id}>
              <CardContent className="space-y-3 p-5">
                {poem.coverImageUrl && (
                  <img
                    src={poem.coverImageUrl}
                    alt=""
                    className="h-40 w-full rounded-md object-cover"
                  />
                )}

                <div>
                  <h3 className="font-semibold">{poem.title}</h3>
                  <p className="mt-1 line-clamp-3 whitespace-pre-wrap text-sm text-muted-foreground">
                    {poem.content}
                  </p>
                </div>

                <p className="text-xs text-muted-foreground">
                  {poem.published ? "Published" : "Draft"}
                </p>

                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(`/app/poems/${poem.id}`)}
                  >
                    View
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => startEditing(poem)}
                  >
                    <Pencil />
                    Edit
                  </Button>

                  <Button
                    type="button"
                    variant="destructive"
                    disabled={deleteMutation.isPending}
                    onClick={() => void handleDelete(poem)}
                  >
                    <Trash2 />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {mutationError && (
          <p role="alert" className="text-sm text-destructive">
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
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </span>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold tabular-nums">
            {value.toLocaleString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}