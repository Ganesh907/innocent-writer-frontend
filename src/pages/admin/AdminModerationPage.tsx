import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ImageWithSkeleton } from "@/components/skeletons";
import { Card, CardContent } from "@/components/ui/card";
import { adminQueryKeys } from "@/features/admin/adminQueryKeys";
import {
  getAdminPoems,
  setAdminPoemPublication,
} from "@/features/admin/adminApi";
import { poemQueryKeys } from "@/features/poems/poemQueryKeys";
import { getApiErrorMessage } from "@/lib/api/apiError";

const PAGE_SIZE = 12;

type PublicationFilter = "all" | "published" | "unpublished";

export function AdminModerationPage() {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<PublicationFilter>("all");

  const published = filter === "all" ? undefined : filter === "published";

  const params = {
    page,
    limit: PAGE_SIZE,
    ...(published === undefined ? {} : { published }),
  };

  const poemsQuery = useQuery({
    queryKey: adminQueryKeys.poemList(params),
    queryFn: ({ signal }) => getAdminPoems(params, signal),
  });

  const publicationMutation = useMutation({
    mutationFn: ({
      id,
      published: nextPublished,
    }: {
      id: string;
      published: boolean;
    }) => setAdminPoemPublication(id, nextPublished),

    onSuccess: async () => {
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
      ]);
    },
  });

  const pagination = poemsQuery.data?.pagination;
  const poems = poemsQuery.data?.data ?? [];

  function changeFilter(nextFilter: PublicationFilter) {
    setFilter(nextFilter);
    setPage(1);
    publicationMutation.reset();
  }

  function togglePublication(
    id: string,
    title: string,
    currentlyPublished: boolean,
  ) {
    const nextPublished = !currentlyPublished;

    const confirmed = window.confirm(
      nextPublished
        ? `Publish "${title}"? It will become publicly visible.`
        : `Unpublish "${title}"? It will no longer be publicly visible.`,
    );

    if (!confirmed) return;

    publicationMutation.mutate({
      id,
      published: nextPublished,
    });
  }

  return (
    <div className="space-y-6 py-4">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">
            Innocent Writer · Administration
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Content moderation
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Review publication status and control which poems are publicly
            visible.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => void poemsQuery.refetch()}
          disabled={poemsQuery.isFetching}
        >
          <RefreshCw className={poemsQuery.isFetching ? "animate-spin" : ""} />
          Refresh
        </Button>
      </header>

      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => changeFilter("all")}
        >
          All poems
        </Button>
        <Button
          size="sm"
          variant={filter === "published" ? "default" : "outline"}
          onClick={() => changeFilter("published")}
        >
          Published
        </Button>
        <Button
          size="sm"
          variant={filter === "unpublished" ? "default" : "outline"}
          onClick={() => changeFilter("unpublished")}
        >
          Unpublished
        </Button>
      </div>

      {poemsQuery.isPending ? (
        <p className="text-sm text-muted-foreground">Loading poems...</p>
      ) : poemsQuery.isError ? (
        <Card>
          <CardContent className="space-y-3 p-5">
            <p role="alert" className="text-sm text-destructive">
              Could not load poems: {getApiErrorMessage(poemsQuery.error)}
            </p>
            <Button variant="outline" onClick={() => void poemsQuery.refetch()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : poems.length === 0 ? (
        <Card>
          <CardContent className="p-5 text-sm text-muted-foreground">
            No poems match this filter.
          </CardContent>
        </Card>
      ) : (
        <section className="space-y-3">
          {poems.map((poem) => {
            const isUpdating =
              publicationMutation.isPending &&
              publicationMutation.variables?.id === poem.id;

            return (
              <Card key={poem.id}>
                <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:justify-between sm:p-5">
                  <div className="flex min-w-0 gap-4">
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
                      <h2 className="break-words font-semibold">
                        {poem.title}
                      </h2>
                      <p className="mt-1 text-xs text-muted-foreground">
                        By {poem.authorName ?? "Unknown author"}
                      </p>
                      <p className="mt-2 line-clamp-3 whitespace-pre-wrap text-sm text-muted-foreground">
                        {poem.content}
                      </p>
                      <span
                        className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          poem.published
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {poem.published ? "Published" : "Unpublished"}
                      </span>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant={poem.published ? "outline" : "default"}
                    disabled={publicationMutation.isPending}
                    onClick={() =>
                      togglePublication(poem.id, poem.title, poem.published)
                    }
                  >
                    {isUpdating ? (
                      <>
                        <RefreshCw className="animate-spin" />
                        Saving...
                      </>
                    ) : poem.published ? (
                      <>
                        <EyeOff />
                        Unpublish
                      </>
                    ) : (
                      <>
                        <Eye />
                        Publish
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </section>
      )}

      {publicationMutation.isError && (
        <p role="alert" className="text-sm text-destructive">
          Publication update failed:{" "}
          {getApiErrorMessage(publicationMutation.error)}
        </p>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.totalPages} ·{" "}
            {pagination.total} poems
          </p>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1 || poemsQuery.isFetching}
              onClick={() => setPage((current) => current - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= pagination.totalPages || poemsQuery.isFetching}
              onClick={() => setPage((current) => current + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// import { useState } from "react";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { Eye, EyeOff, RefreshCw } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { adminQueryKeys } from "@/features/admin/adminQueryKeys";
// import {
//   getAdminPoems,
//   setAdminPoemPublication,
// } from "@/features/admin/adminApi";
// import { poemQueryKeys } from "@/features/poems/poemQueryKeys";
// import { getApiErrorMessage } from "@/lib/api/apiError";

// const PAGE_SIZE = 12;

// type PublicationFilter = "all" | "published" | "unpublished";

// export function AdminModerationPage() {
//   const queryClient = useQueryClient();

//   const [page, setPage] = useState(1);
//   const [filter, setFilter] = useState<PublicationFilter>("all");

//   const published = filter === "all" ? undefined : filter === "published";

//   const params = {
//     page,
//     limit: PAGE_SIZE,
//     ...(published === undefined ? {} : { published }),
//   };

//   const poemsQuery = useQuery({
//     queryKey: adminQueryKeys.poemList(params),
//     queryFn: ({ signal }) => getAdminPoems(params, signal),
//   });

//   const publicationMutation = useMutation({
//     mutationFn: ({
//       id,
//       published: nextPublished,
//     }: {
//       id: string;
//       published: boolean;
//     }) => setAdminPoemPublication(id, nextPublished),

//     onSuccess: async () => {
//       await Promise.all([
//         queryClient.invalidateQueries({
//           queryKey: adminQueryKeys.poems(),
//         }),
//         queryClient.invalidateQueries({
//           queryKey: adminQueryKeys.analytics(),
//         }),
//         queryClient.invalidateQueries({
//           queryKey: poemQueryKeys.lists(),
//         }),
//         queryClient.invalidateQueries({
//           queryKey: poemQueryKeys.details(),
//         }),
//       ]);
//     },
//   });

//   const pagination = poemsQuery.data?.pagination;
//   const poems = poemsQuery.data?.data ?? [];

//   function changeFilter(nextFilter: PublicationFilter) {
//     setFilter(nextFilter);
//     setPage(1);
//     publicationMutation.reset();
//   }

//   function togglePublication(
//     id: string,
//     title: string,
//     currentlyPublished: boolean,
//   ) {
//     const nextPublished = !currentlyPublished;

//     const confirmed = window.confirm(
//       nextPublished
//         ? `Publish "${title}"? It will become publicly visible.`
//         : `Unpublish "${title}"? It will no longer be publicly visible.`,
//     );

//     if (!confirmed) return;

//     publicationMutation.mutate({
//       id,
//       published: nextPublished,
//     });
//   }

//   return (
//     <div className="space-y-6 py-4">
//       <header className="flex flex-wrap items-start justify-between gap-4">
//         <div>
//           <p className="text-sm text-muted-foreground">
//             Innocent Writer · Administration
//           </p>
//           <h1 className="mt-1 text-3xl font-semibold tracking-tight">
//             Content moderation
//           </h1>
//           <p className="mt-2 text-sm text-muted-foreground">
//             Review publication status and control which poems are publicly
//             visible.
//           </p>
//         </div>

//         <Button
//           variant="outline"
//           onClick={() => void poemsQuery.refetch()}
//           disabled={poemsQuery.isFetching}
//         >
//           <RefreshCw className={poemsQuery.isFetching ? "animate-spin" : ""} />
//           Refresh
//         </Button>
//       </header>

//       <div className="flex flex-wrap gap-2">
//         <Button
//           size="sm"
//           variant={filter === "all" ? "default" : "outline"}
//           onClick={() => changeFilter("all")}
//         >
//           All poems
//         </Button>
//         <Button
//           size="sm"
//           variant={filter === "published" ? "default" : "outline"}
//           onClick={() => changeFilter("published")}
//         >
//           Published
//         </Button>
//         <Button
//           size="sm"
//           variant={filter === "unpublished" ? "default" : "outline"}
//           onClick={() => changeFilter("unpublished")}
//         >
//           Unpublished
//         </Button>
//       </div>

//       {poemsQuery.isPending ? (
//         <p className="text-sm text-muted-foreground">Loading poems...</p>
//       ) : poemsQuery.isError ? (
//         <Card>
//           <CardContent className="space-y-3 p-5">
//             <p role="alert" className="text-sm text-destructive">
//               Could not load poems: {getApiErrorMessage(poemsQuery.error)}
//             </p>
//             <Button variant="outline" onClick={() => void poemsQuery.refetch()}>
//               Retry
//             </Button>
//           </CardContent>
//         </Card>
//       ) : poems.length === 0 ? (
//         <Card>
//           <CardContent className="p-5 text-sm text-muted-foreground">
//             No poems match this filter.
//           </CardContent>
//         </Card>
//       ) : (
//         <section className="space-y-3">
//           {poems.map((poem) => {
//             const isUpdating =
//               publicationMutation.isPending &&
//               publicationMutation.variables?.id === poem.id;

//             return (
//               <Card key={poem.id}>
//                 <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:justify-between sm:p-5">
//                   <div className="flex min-w-0 gap-4">
//                     {poem.coverImageUrl && (
//                       <img
//                         src={poem.coverImageUrl}
//                         alt={`${poem.title} cover`}
//                         className="size-20 shrink-0 rounded-md object-cover"
//                       />
//                     )}

//                     <div className="min-w-0">
//                       <h2 className="break-words font-semibold">
//                         {poem.title}
//                       </h2>
//                       <p className="mt-1 text-xs text-muted-foreground">
//                         By {poem.authorName ?? "Unknown author"}
//                       </p>
//                       <p className="mt-2 line-clamp-3 whitespace-pre-wrap text-sm text-muted-foreground">
//                         {poem.content}
//                       </p>
//                       <span
//                         className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
//                           poem.published
//                             ? "bg-primary/10 text-primary"
//                             : "bg-muted text-muted-foreground"
//                         }`}
//                       >
//                         {poem.published ? "Published" : "Unpublished"}
//                       </span>
//                     </div>
//                   </div>

//                   <Button
//                     size="sm"
//                     variant={poem.published ? "outline" : "default"}
//                     disabled={publicationMutation.isPending}
//                     onClick={() =>
//                       togglePublication(poem.id, poem.title, poem.published)
//                     }
//                   >
//                     {isUpdating ? (
//                       <>
//                         <RefreshCw className="animate-spin" />
//                         Saving...
//                       </>
//                     ) : poem.published ? (
//                       <>
//                         <EyeOff />
//                         Unpublish
//                       </>
//                     ) : (
//                       <>
//                         <Eye />
//                         Publish
//                       </>
//                     )}
//                   </Button>
//                 </CardContent>
//               </Card>
//             );
//           })}
//         </section>
//       )}

//       {publicationMutation.isError && (
//         <p role="alert" className="text-sm text-destructive">
//           Publication update failed:{" "}
//           {getApiErrorMessage(publicationMutation.error)}
//         </p>
//       )}

//       {pagination && pagination.totalPages > 1 && (
//         <div className="flex flex-wrap items-center justify-between gap-3">
//           <p className="text-sm text-muted-foreground">
//             Page {pagination.page} of {pagination.totalPages} ·{" "}
//             {pagination.total} poems
//           </p>

//           <div className="flex gap-2">
//             <Button
//               variant="outline"
//               size="sm"
//               disabled={page <= 1 || poemsQuery.isFetching}
//               onClick={() => setPage((current) => current - 1)}
//             >
//               Previous
//             </Button>
//             <Button
//               variant="outline"
//               size="sm"
//               disabled={page >= pagination.totalPages || poemsQuery.isFetching}
//               onClick={() => setPage((current) => current + 1)}
//             >
//               Next
//             </Button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
