import { useQuery } from "@tanstack/react-query";
import { getActiveResume } from "./resumeApi";

export function useActiveResume() {
  return useQuery({
    queryKey: ["portfolio", "resume"],
    queryFn: ({ signal }) => getActiveResume(signal),
    staleTime: 60_000,
  });
}