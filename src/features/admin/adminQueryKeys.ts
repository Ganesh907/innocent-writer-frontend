import type {
  AdminPoemsParams,
  AdminUsersParams,
} from "./adminApi";

export const adminQueryKeys = {
  all: ["admin"] as const,

  analytics: () =>
    [...adminQueryKeys.all, "analytics"] as const,

  users: () =>
    [...adminQueryKeys.all, "users"] as const,

  userList: (params: AdminUsersParams) =>
    [...adminQueryKeys.users(), params] as const,

  poems: () =>
    [...adminQueryKeys.all, "poems"] as const,

  poemList: (params: AdminPoemsParams) =>
    [...adminQueryKeys.poems(), params] as const,
};