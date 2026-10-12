import type { AdminPoemsParams } from "./adminApi";

export const adminQueryKeys = {
  all: ["admin"] as const,

  analytics: () =>
    [...adminQueryKeys.all, "analytics"] as const,

  users: () =>
    [...adminQueryKeys.all, "users"] as const,

  poems: () =>
    [...adminQueryKeys.all, "poems"] as const,

  poemList: (params: AdminPoemsParams) =>
    [...adminQueryKeys.poems(), params] as const,
};