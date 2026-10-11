
import type { GetPoemsParams } from "@/contracts/poem";

export const poemQueryKeys = {
  all: ["poems"] as const,

  lists: () => [...poemQueryKeys.all, "list"] as const,

  list: (params: GetPoemsParams) =>
    [...poemQueryKeys.lists(), params] as const,
};
