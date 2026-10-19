import { useMemo, useState, type FormEvent } from "react";
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  BookOpen,
  Eye,
  Heart,
  MessageCircle,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageFilePreview, ImageWithSkeleton } from "@/components/skeletons";
import {
  createPoem,
  deletePoem,
  uploadPoemImage,
  updatePoem,
} from "@/features/poems/poemApi";

import { getAdminPoems } from "@/features/admin/adminApi";
import { adminQueryKeys } from "@/features/admin/adminQueryKeys";

import type {
  CreatePoemRequest,
  Poem,
  UpdatePoemRequest,
} from "@/contracts/poem";

import { getPoemAnalytics } from "@/features/analytics/analyticsApi";

import { poemQueryKeys } from "@/features/poems/poemQueryKeys";
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

export function AdminHomePage() {
  const queryClient = useQueryClient();

  const [form, setForm] = useState<PoemForm>(EMPTY_FORM);
  const [editingPoem, setEditingPoem] = useState<Poem | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const poemsQuery = useQuery({
    queryKey: adminQueryKeys.poemList({
      page: 1,
      limit: PAGE_SIZE,
    }),
    queryFn: () =>
      getAdminPoems({
        page: 1,
        limit: PAGE_SIZE,
      }),
  });

  const poems = poemsQuery.data?.data ?? [];

  const analyticsQueries = useQueries({
    queries: poems.map((poem) => ({
      queryKey: poemQueryKeys.analytics(poem.id),
      queryFn: ({ signal }: { signal: AbortSignal }) =>
        getPoemAnalytics(poem.id, signal),
    })),
  });

  const totals = useMemo(() => {
    return analyticsQueries.reduce(
      (result, query) => {
          result.views += query.data?.views ?? 0;
        result.likes += query.data?.likes ?? 0;
        result.comments += query.data?.comments ?? 0;
        return result;
      },
      { views: 0, likes: 0, comments: 0 },
    );
  }, [analyticsQueries]);

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
        queryKey: adminQueryKeys.poems(),
      }),
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.analytics(),
      }),
      queryClient.invalidateQueries({
        queryKey: poemQueryKeys.lists(),
      }),
      queryClient.invalidateQueries({
        queryKey: poemQueryKeys.details(),
      }),
      queryClient.invalidateQueries({
        queryKey: poemQueryKeys.all,
      }),
    ]);
  }
  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingPoem(null);
    setFormError(null);
  }

  function updateField<K extends keyof PoemForm>(key: K, value: PoemForm[K]) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
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
    const confirmed = window.confirm(
      `Delete "${poem.title}"? This cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      await deleteMutation.mutateAsync(poem.id);
    } catch {
      // The API error is displayed in the dashboard.
    }
  }
  const mutationError = deleteMutation.isError
    ? getApiErrorMessage(deleteMutation.error)
    : null;

  return (
    <main className="space-y-8 py-8 sm:py-12">
      <header>
        <p className="text-sm text-muted-foreground">
          Innocent Writer · Administration
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Create, view, edit, and delete poems and monitor their engagement.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric icon={<BookOpen />} label="Poems loaded" value={poems.length} />
        <Metric icon={<Eye />} label="Views" value={totals.views} />
        <Metric icon={<Heart />} label="Likes" value={totals.likes} />
        <Metric
          icon={<MessageCircle />}
          label="Comments"
          value={totals.comments}
        />
      </section>

      <section className="space-y-4" id="poem-form">
        <div>
          <h2 className="text-xl font-semibold">
            {editingPoem ? "Edit poem" : "Create poem"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Images must be JPEG, PNG, or WebP and no larger than 5 MB each.
          </p>
        </div>

        <Card>
          <CardContent className="p-5 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="admin-poem-title">Title</Label>
                <Input
                  id="admin-poem-title"
                  value={form.title}
                  onChange={(event) => updateField("title", event.target.value)}
                  maxLength={200}
                  placeholder="Enter poem title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-poem-content">Content</Label>
                <textarea
                  id="admin-poem-content"
                  value={form.content}
                  onChange={(event) =>
                    updateField("content", event.target.value)
                  }
                  rows={8}
                  placeholder="Write your poem..."
                  required
                  className="w-full resize-y rounded-md border border-input bg-transparent px-3 py-3 text-sm leading-6"
                />
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <ImageInput
                  id="admin-cover-image"
                  label="Cover image"
                  file={form.coverImageFile}
                  existingUrl={editingPoem?.coverImageUrl ?? null}
                  onChange={(file) => updateField("coverImageFile", file)}
                />


                 <ImageInput
                  id="admin-poem-image"
                  label="Poem image"
                  file={form.poemImageFile}
                  existingUrl={editingPoem?.poemImageUrl ?? null}
                  onChange={(file) => updateField("poemImageFile", file)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-instagram-url">
                  Instagram URL (optional)
                </Label>
                <Input
                  id="admin-instagram-url"
                  type="url"
                  value={form.instagramPostUrl}
                  onChange={(event) =>
                    updateField("instagramPostUrl", event.target.value)
                  }
                  placeholder="https://www.instagram.com/p/..."
                />
              </div>

              {formError && (
                <p role="alert" className="text-sm text-destructive">
                  {formError}
                </p>
              )}

              <div className="flex flex-wrap gap-3">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <RefreshCw className="animate-spin" />
                  ) : editingPoem ? (
                    <Pencil />
                  ) : (
                    <Plus />
                  )}
                  {isSaving
                    ? "Saving..."
                    : editingPoem
                      ? "Save changes"
                      : "Create poem"}
                </Button>

                {editingPoem && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    disabled={isSaving}
                  >
                    <X />
                    Cancel edit
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4" id="poems">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">Manage poems</h2>
            <p className="text-sm text-muted-foreground">
              View and manage poems returned by the API.
            </p>
          </div>


   <Button
            variant="outline"
            onClick={() => void poemsQuery.refetch()}
            disabled={poemsQuery.isFetching}
          >
            <RefreshCw
              className={poemsQuery.isFetching ? "animate-spin" : ""}
            />
            Refresh
          </Button>
        </div>

        {poemsQuery.isPending ? (
          <p className="text-sm text-muted-foreground">Loading poems...</p>
        ) : poemsQuery.isError ? (
          <Card>
            <CardContent className="space-y-3 p-5">
              <p className="text-sm text-destructive">
                Could not load poems: {getApiErrorMessage(poemsQuery.error)}
              </p>
              <Button
                variant="outline"
                onClick={() => void poemsQuery.refetch()}
              >
                Retry
              </Button>
            </CardContent>
          </Card>
        ) : poems.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground">
              No poems found. Use the form above to create the first poem.
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {poems.map((poem) => (
              <Card key={poem.id} className="overflow-hidden">
                <CardContent className="space-y-4 p-5">
                  <div className="flex gap-4">
                    {poem.coverImageUrl && (
                      <ImageWithSkeleton
                        src={poem.coverImageUrl}
                        alt={`${poem.title} cover`}
                        loading="lazy"
                        decoding="async"
                        wrapperClassName="size-20 shrink-0 rounded-md"
                        className="size-full object-cover"
                      />
                    )}

                    <div className="min-w-0">
                      <h3 className="break-words font-semibold">
                        {poem.title}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        By {poem.authorName ?? "Unknown author"}
                      </p>
                      <p className="mt-1 text-xs font-medium">
                        {poem.published ? (
                          <span className="text-primary">Published</span>
                        ) : (
                          <span className="text-muted-foreground">
                            Unpublished
                          </span>
                        )}
                      </p>
                      <p className="mt-2 line-clamp-3 whitespace-pre-wrap text-sm text-muted-foreground">
                        {poem.content}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startEditing(poem)}
                    >
                      <Pencil />
                      Edit
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => void handleDelete(poem)}
                      disabled={
                        deleteMutation.isPending &&
                        deleteMutation.variables === poem.id
                      }
                    >
                      <Trash2 />
                      {deleteMutation.isPending &&
                      deleteMutation.variables === poem.id
                        ? "Deleting..."
                        : "Delete"}
                    </Button>
                  </div>

 {poem.instagramPostUrl && (
                    <a
                      href={poem.instagramPostUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="break-all text-sm text-primary underline"
                    >
                      Instagram post
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {mutationError && (
          <p role="alert" className="text-sm text-destructive">
            Delete failed: {mutationError}
          </p>
        )}

        <p className="text-xs text-muted-foreground">
          Analytics totals above are calculated from the poems currently loaded
          by this dashboard. The list request is limited to 100 poems.
        </p>
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

function ImageInput({
  id,
  label,
  file,
  existingUrl,
  onChange,
}: {
  id: string;
  label: string;
  file: File | null;
  existingUrl: string | null;
  onChange: (file: File | null) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>

      <ImageFilePreview
        file={file}
        existingUrl={existingUrl}
        alt={`${file ? "Selected" : "Current"} ${label}`}
        wrapperClassName="h-32 w-full rounded-md"
        className="h-full w-full object-cover"
      />

      <Input
        id={id}
        type="file"
        accept={IMAGE_ACCEPT}
        onChange={(event) => onChange(event.target.files?.[0] ?? null)}
      />

      <p className="text-xs text-muted-foreground">
        {file
          ? `Selected: ${file.name}`
          : existingUrl
            ? "Existing image will be retained unless replaced."
            : "Select an image."}
      </p>
    </div>
  );
}

// import { useMemo, useState, type FormEvent } from "react";
// import {
//   useMutation,
//   useQueries,
//   useQuery,
//   useQueryClient,
// } from "@tanstack/react-query";
// import {
//   BookOpen,
//   Eye,
//   Heart,
//   MessageCircle,
//   Pencil,
//   Plus,
//   RefreshCw,
//   Trash2,
//   X,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   createPoem,
//   deletePoem,
//   imageFileToDataUri,
//   updatePoem,
// } from "@/features/poems/poemApi";

// import { getAdminPoems } from "@/features/admin/adminApi";
// import { adminQueryKeys } from "@/features/admin/adminQueryKeys";

// import type {
//   CreatePoemRequest,
//   Poem,
//   UpdatePoemRequest,
// } from "@/contracts/poem";

// import { getPoemAnalytics } from "@/features/analytics/analyticsApi";

// import { poemQueryKeys } from "@/features/poems/poemQueryKeys";
// import { getApiErrorMessage } from "@/lib/api/apiError";

// const PAGE_SIZE = 100;
// const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp";

// interface PoemForm {
//   title: string;
//   content: string;
//   instagramPostUrl: string;
//   coverImageFile: File | null;
//   poemImageFile: File | null;
// }

// const EMPTY_FORM: PoemForm = {
//   title: "",
//   content: "",
//   instagramPostUrl: "",
//   coverImageFile: null,
//   poemImageFile: null,
// };

// export function AdminHomePage() {
//   const queryClient = useQueryClient();

//   const [form, setForm] = useState<PoemForm>(EMPTY_FORM);
//   const [editingPoem, setEditingPoem] = useState<Poem | null>(null);
//   const [formError, setFormError] = useState<string | null>(null);

//   const poemsQuery = useQuery({
//     queryKey: adminQueryKeys.poemList({
//       page: 1,
//       limit: PAGE_SIZE,
//     }),
//     queryFn: () =>
//       getAdminPoems({
//         page: 1,
//         limit: PAGE_SIZE,
//       }),
//   });

//   const poems = poemsQuery.data?.data ?? [];

//   const analyticsQueries = useQueries({
//     queries: poems.map((poem) => ({
//       queryKey: poemQueryKeys.analytics(poem.id),
//       queryFn: ({ signal }: { signal: AbortSignal }) =>
//         getPoemAnalytics(poem.id, signal),
//     })),
//   });

//   const totals = useMemo(() => {
//     return analyticsQueries.reduce(
//       (result, query) => {
//         result.views += query.data?.views ?? 0;
//         result.likes += query.data?.likes ?? 0;
//         result.comments += query.data?.comments ?? 0;
//         return result;
//       },
//       { views: 0, likes: 0, comments: 0 },
//     );
//   }, [analyticsQueries]);

//   const createMutation = useMutation({
//     mutationFn: (payload: CreatePoemRequest) => createPoem(payload),
//     onSuccess: async () => {
//       resetForm();
//       await refreshData();
//     },
//   });

//   const updateMutation = useMutation({
//     mutationFn: ({ id, payload }: { id: string; payload: UpdatePoemRequest }) =>
//       updatePoem(id, payload),
//     onSuccess: async () => {
//       resetForm();
//       await refreshData();
//     },
//   });

//   const deleteMutation = useMutation({
//     mutationFn: (id: string) => deletePoem(id),
//     onSuccess: refreshData,
//   });

//   const isSaving = createMutation.isPending || updateMutation.isPending;

//   async function refreshData() {
//     await Promise.all([
//       queryClient.invalidateQueries({
//         queryKey: adminQueryKeys.poems(),
//       }),
//       queryClient.invalidateQueries({
//         queryKey: adminQueryKeys.analytics(),
//       }),
//       queryClient.invalidateQueries({
//         queryKey: poemQueryKeys.lists(),
//       }),
//       queryClient.invalidateQueries({
//         queryKey: poemQueryKeys.details(),
//       }),
//       queryClient.invalidateQueries({
//         queryKey: poemQueryKeys.all,
//       }),
//     ]);
//   }
//   function resetForm() {
//     setForm(EMPTY_FORM);
//     setEditingPoem(null);
//     setFormError(null);
//   }

//   function updateField<K extends keyof PoemForm>(key: K, value: PoemForm[K]) {
//     setForm((current) => ({
//       ...current,
//       [key]: value,
//     }));
//   }

//   function startEditing(poem: Poem) {
//     setEditingPoem(poem);
//     setForm({
//       title: poem.title,
//       content: poem.content,
//       instagramPostUrl: poem.instagramPostUrl ?? "",
//       coverImageFile: null,
//       poemImageFile: null,
//     });
//     setFormError(null);

//     window.scrollTo({ top: 0, behavior: "smooth" });
//   }

//   async function handleSubmit(event: FormEvent<HTMLFormElement>) {
//     event.preventDefault();
//     setFormError(null);

//     if (!form.title.trim() || !form.content.trim()) {
//       setFormError("Title and poem content are required.");
//       return;
//     }

//     if (!editingPoem && (!form.coverImageFile || !form.poemImageFile)) {
//       setFormError(
//         "Select both a cover image and a poem image to create a poem.",
//       );
//       return;
//     }

//     try {
//       const coverImage = form.coverImageFile
//         ? await imageFileToDataUri(form.coverImageFile)
//         : undefined;

//       const poemImage = form.poemImageFile
//         ? await imageFileToDataUri(form.poemImageFile)
//         : undefined;

//       const instagramPostUrl = form.instagramPostUrl.trim() || null;

//       if (editingPoem) {
//         const payload: UpdatePoemRequest = {
//           title: form.title.trim(),
//           content: form.content.trim(),
//           instagramPostUrl,
//           ...(coverImage ? { coverImage } : {}),
//           ...(poemImage ? { poemImage } : {}),
//         };

//         await updateMutation.mutateAsync({
//           id: editingPoem.id,
//           payload,
//         });
//       } else {
//         const payload: CreatePoemRequest = {
//           title: form.title.trim(),
//           content: form.content.trim(),
//           coverImage: coverImage!,
//           poemImage: poemImage!,
//           instagramPostUrl,
//         };

//         await createMutation.mutateAsync(payload);
//       }
//     } catch (error) {
//       setFormError(getApiErrorMessage(error));
//     }
//   }

//   async function handleDelete(poem: Poem) {
//     const confirmed = window.confirm(
//       `Delete "${poem.title}"? This cannot be undone.`,
//     );

//     if (!confirmed) return;

//     try {
//       await deleteMutation.mutateAsync(poem.id);
//     } catch {
//       // The API error is displayed in the dashboard.
//     }
//   }

//   const mutationError = deleteMutation.isError
//     ? getApiErrorMessage(deleteMutation.error)
//     : null;

//   return (
//     <main className="space-y-8 py-8 sm:py-12">
//       <header>
//         <p className="text-sm text-muted-foreground">
//           Innocent Writer · Administration
//         </p>
//         <h1 className="mt-1 text-3xl font-semibold tracking-tight">
//           Admin Dashboard
//         </h1>
//         <p className="mt-2 text-sm text-muted-foreground">
//           Create, view, edit, and delete poems and monitor their engagement.
//         </p>
//       </header>

//       <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
//         <Metric icon={<BookOpen />} label="Poems loaded" value={poems.length} />
//         <Metric icon={<Eye />} label="Views" value={totals.views} />
//         <Metric icon={<Heart />} label="Likes" value={totals.likes} />
//         <Metric
//           icon={<MessageCircle />}
//           label="Comments"
//           value={totals.comments}
//         />
//       </section>

//       <section className="space-y-4" id="poem-form">
//         <div>
//           <h2 className="text-xl font-semibold">
//             {editingPoem ? "Edit poem" : "Create poem"}
//           </h2>
//           <p className="mt-1 text-sm text-muted-foreground">
//             Images must be JPEG, PNG, or WebP and no larger than 5 MB each.
//           </p>
//         </div>

//         <Card>
//           <CardContent className="p-5 sm:p-6">
//             <form onSubmit={handleSubmit} className="space-y-5">
//               <div className="space-y-2">
//                 <Label htmlFor="admin-poem-title">Title</Label>
//                 <Input
//                   id="admin-poem-title"
//                   value={form.title}
//                   onChange={(event) => updateField("title", event.target.value)}
//                   maxLength={200}
//                   placeholder="Enter poem title"
//                   required
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="admin-poem-content">Content</Label>
//                 <textarea
//                   id="admin-poem-content"
//                   value={form.content}
//                   onChange={(event) =>
//                     updateField("content", event.target.value)
//                   }
//                   rows={8}
//                   placeholder="Write your poem..."
//                   required
//                   className="w-full resize-y rounded-md border border-input bg-transparent px-3 py-3 text-sm leading-6"
//                 />
//               </div>

//               <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
//                 <ImageInput
//                   id="admin-cover-image"
//                   label="Cover image"
//                   file={form.coverImageFile}
//                   existingUrl={editingPoem?.coverImageUrl ?? null}
//                   onChange={(file) => updateField("coverImageFile", file)}
//                 />

//                 <ImageInput
//                   id="admin-poem-image"
//                   label="Poem image"
//                   file={form.poemImageFile}
//                   existingUrl={editingPoem?.poemImageUrl ?? null}
//                   onChange={(file) => updateField("poemImageFile", file)}
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="admin-instagram-url">
//                   Instagram URL (optional)
//                 </Label>
//                 <Input
//                   id="admin-instagram-url"
//                   type="url"
//                   value={form.instagramPostUrl}
//                   onChange={(event) =>
//                     updateField("instagramPostUrl", event.target.value)
//                   }
//                   placeholder="https://www.instagram.com/p/..."
//                 />
//               </div>

//               {formError && (
//                 <p role="alert" className="text-sm text-destructive">
//                   {formError}
//                 </p>
//               )}

//               <div className="flex flex-wrap gap-3">
//                 <Button type="submit" disabled={isSaving}>
//                   {isSaving ? (
//                     <RefreshCw className="animate-spin" />
//                   ) : editingPoem ? (
//                     <Pencil />
//                   ) : (
//                     <Plus />
//                   )}
//                   {isSaving
//                     ? "Saving..."
//                     : editingPoem
//                       ? "Save changes"
//                       : "Create poem"}
//                 </Button>

//                 {editingPoem && (
//                   <Button
//                     type="button"
//                     variant="outline"
//                     onClick={resetForm}
//                     disabled={isSaving}
//                   >
//                     <X />
//                     Cancel edit
//                   </Button>
//                 )}
//               </div>
//             </form>
//           </CardContent>
//         </Card>
//       </section>

//       <section className="space-y-4" id="poems">
//         <div className="flex flex-wrap items-center justify-between gap-3">
//           <div>
//             <h2 className="text-xl font-semibold">Manage poems</h2>
//             <p className="text-sm text-muted-foreground">
//               View and manage poems returned by the API.
//             </p>
//           </div>

//           <Button
//             variant="outline"
//             onClick={() => void poemsQuery.refetch()}
//             disabled={poemsQuery.isFetching}
//           >
//             <RefreshCw
//               className={poemsQuery.isFetching ? "animate-spin" : ""}
//             />
//             Refresh
//           </Button>
//         </div>

//         {poemsQuery.isPending ? (
//           <p className="text-sm text-muted-foreground">Loading poems...</p>
//         ) : poemsQuery.isError ? (
//           <Card>
//             <CardContent className="space-y-3 p-5">
//               <p className="text-sm text-destructive">
//                 Could not load poems: {getApiErrorMessage(poemsQuery.error)}
//               </p>
//               <Button
//                 variant="outline"
//                 onClick={() => void poemsQuery.refetch()}
//               >
//                 Retry
//               </Button>
//             </CardContent>
//           </Card>
//         ) : poems.length === 0 ? (
//           <Card>
//             <CardContent className="p-6 text-sm text-muted-foreground">
//               No poems found. Use the form above to create the first poem.
//             </CardContent>
//           </Card>
//         ) : (
//           <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
//             {poems.map((poem) => (
//               <Card key={poem.id} className="overflow-hidden">
//                 <CardContent className="space-y-4 p-5">
//                   <div className="flex gap-4">
//                     {poem.coverImageUrl && (
//                       <img
//                         src={poem.coverImageUrl}
//                         alt={`${poem.title} cover`}
//                         className="size-20 shrink-0 rounded-md object-cover"
//                       />
//                     )}

//                     <div className="min-w-0">
//                       <h3 className="break-words font-semibold">
//                         {poem.title}
//                       </h3>
//                       <p className="mt-1 text-xs text-muted-foreground">
//                         By {poem.authorName ?? "Unknown author"}
//                       </p>
//                       <p className="mt-1 text-xs font-medium">
//                         {poem.published ? (
//                           <span className="text-primary">Published</span>
//                         ) : (
//                           <span className="text-muted-foreground">
//                             Unpublished
//                           </span>
//                         )}
//                       </p>
//                       <p className="mt-2 line-clamp-3 whitespace-pre-wrap text-sm text-muted-foreground">
//                         {poem.content}
//                       </p>
//                     </div>
//                   </div>

//                   <div className="flex flex-wrap gap-2">
//                     <Button
//                       size="sm"
//                       variant="outline"
//                       onClick={() => startEditing(poem)}
//                     >
//                       <Pencil />
//                       Edit
//                     </Button>

//                     <Button
//                       size="sm"
//                       variant="destructive"
//                       onClick={() => void handleDelete(poem)}
//                       disabled={
//                         deleteMutation.isPending &&
//                         deleteMutation.variables === poem.id
//                       }
//                     >
//                       <Trash2 />
//                       {deleteMutation.isPending &&
//                       deleteMutation.variables === poem.id
//                         ? "Deleting..."
//                         : "Delete"}
//                     </Button>
//                   </div>

//                   {poem.instagramPostUrl && (
//                     <a
//                       href={poem.instagramPostUrl}
//                       target="_blank"
//                       rel="noreferrer"
//                       className="break-all text-sm text-primary underline"
//                     >
//                       Instagram post
//                     </a>
//                   )}
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         )}

//         {mutationError && (
//           <p role="alert" className="text-sm text-destructive">
//             Delete failed: {mutationError}
//           </p>
//         )}

//         <p className="text-xs text-muted-foreground">
//           Analytics totals above are calculated from the poems currently loaded
//           by this dashboard. The list request is limited to 100 poems.
//         </p>
//       </section>
//     </main>
//   );
// }

// function Metric({
//   icon,
//   label,
//   value,
// }: {
//   icon: React.ReactNode;
//   label: string;
//   value: number;
// }) {
//   return (
//     <Card>
//       <CardContent className="flex items-center gap-4 p-5">
//         <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
//           {icon}
//         </span>
//         <div>
//           <p className="text-sm text-muted-foreground">{label}</p>
//           <p className="text-2xl font-semibold tabular-nums">
//             {value.toLocaleString()}
//           </p>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

// function ImageInput({
//   id,
//   label,
//   file,
//   existingUrl,
//   onChange,
// }: {
//   id: string;
//   label: string;
//   file: File | null;
//   existingUrl: string | null;
//   onChange: (file: File | null) => void;
// }) {
//   return (
//     <div className="space-y-2">
//       <Label htmlFor={id}>{label}</Label>

//       {existingUrl && !file && (
//         <img
//           src={existingUrl}
//           alt={`Current ${label}`}
//           className="h-32 w-full rounded-md object-cover"
//         />
//       )}

//       <Input
//         id={id}
//         type="file"
//         accept={IMAGE_ACCEPT}
//         onChange={(event) => onChange(event.target.files?.[0] ?? null)}
//       />

//       <p className="text-xs text-muted-foreground">
//         {file
//           ? `Selected: ${file.name}`
//           : existingUrl
//             ? "Existing image will be retained unless replaced."
//             : "Select an image."}
//       </p>
//     </div>
//   );
// }
