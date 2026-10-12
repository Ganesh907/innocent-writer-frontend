import type { GetPoemsParams } from "@/contracts/poem";

export const poemQueryKeys = {
  all: ["poems"] as const,

  lists: () => [...poemQueryKeys.all, "list"] as const,

  list: (params: GetPoemsParams) =>
    [...poemQueryKeys.lists(), params] as const,

  details: () => [...poemQueryKeys.all, "detail"] as const,

  detail: (id: string) =>
    [...poemQueryKeys.details(), id] as const,

  comments: (id: string) =>
    [...poemQueryKeys.detail(id), "comments"] as const,

  analytics: (id: string) =>
    [...poemQueryKeys.detail(id), "analytics"] as const,
};