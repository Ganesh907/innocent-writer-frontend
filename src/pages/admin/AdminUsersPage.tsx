import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RefreshCw, Shield, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { adminQueryKeys } from "@/features/admin/adminQueryKeys";
import {
  getAdminUsers,
  updateAdminUserRole,
} from "@/features/admin/adminApi";
import type { UserRole } from "@/contracts/auth";
import { useAuth } from "@/features/auth/authContext";
import { getApiErrorMessage } from "@/lib/api/apiError";

export function AdminUsersPage() {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();

  const usersQuery = useQuery({
    queryKey: adminQueryKeys.users(),
    queryFn: ({ signal }) => getAdminUsers(signal),
  });

  const roleMutation = useMutation({
    mutationFn: ({
      id,
      role,
    }: {
      id: string;
      role: UserRole;
    }) => updateAdminUserRole(id, role),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: adminQueryKeys.users(),
        }),
        queryClient.invalidateQueries({
          queryKey: adminQueryKeys.analytics(),
        }),
      ]);
    },
  });

  function changeRole(
    id: string,
    name: string,
    currentRole: UserRole,
  ) {
    const nextRole: UserRole =
      currentRole === "ADMIN" ? "USER" : "ADMIN";

    const confirmed = window.confirm(
      `Change ${name}'s role from ${currentRole} to ${nextRole}?`,
    );

    if (!confirmed) return;

    roleMutation.mutate({ id, role: nextRole });
  }

  return (
    <div className="space-y-6 py-4">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">
            Innocent Writer · Administration
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Users
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Review registered users and manage their roles.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => void usersQuery.refetch()}
          disabled={usersQuery.isFetching}
        >
          <RefreshCw
            className={usersQuery.isFetching ? "animate-spin" : ""}
          />
          Refresh
        </Button>
      </header>

      {usersQuery.isPending ? (
        <p className="text-sm text-muted-foreground">
          Loading users...
        </p>
      ) : usersQuery.isError ? (
        <Card>
          <CardContent className="space-y-3 p-5">
            <p role="alert" className="text-sm text-destructive">
              Could not load users:{" "}
              {getApiErrorMessage(usersQuery.error)}
            </p>
            <Button
              variant="outline"
              onClick={() => void usersQuery.refetch()}
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : usersQuery.data.length === 0 ? (
        <Card>
          <CardContent className="p-5 text-sm text-muted-foreground">
            No users found.
          </CardContent>
        </Card>
      ) : (
        <section className="space-y-3">
          {usersQuery.data.map((adminUser) => {
            const isCurrentUser =
              adminUser.id === currentUser?.id;

            const isUpdating =
              roleMutation.isPending &&
              roleMutation.variables?.id === adminUser.id;

            return (
              <Card key={adminUser.id}>
                <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                  <div className="min-w-0">
                    <p className="break-words font-semibold">
                      {adminUser.name}
                      {isCurrentUser && (
                        <span className="ml-2 text-xs font-normal text-muted-foreground">
                          (you)
                        </span>
                      )}
                    </p>
                    <p className="mt-1 break-all text-sm text-muted-foreground">
                      {adminUser.email}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Joined{" "}
                      {new Date(
                        adminUser.createdAt,
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-xs font-medium">
                      {adminUser.role === "ADMIN" ? (
                        <Shield className="size-3.5" />
                      ) : (
                        <UserRound className="size-3.5" />
                      )}
                      {adminUser.role}
                    </span>

                    {isCurrentUser ? (
                      <span className="text-xs text-muted-foreground">
                        Your role cannot be changed here.
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={roleMutation.isPending}
                        onClick={() =>
                          changeRole(
                            adminUser.id,
                            adminUser.name,
                            adminUser.role,
                          )
                        }
                      >
                        {isUpdating ? (
                          <>
                            <RefreshCw className="animate-spin" />
                            Updating...
                          </>
                        ) : adminUser.role === "ADMIN" ? (
                          "Make user"
                        ) : (
                          "Make admin"
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>
      )}

      {roleMutation.isError && (
        <p role="alert" className="text-sm text-destructive">
          Role update failed:{" "}
          {getApiErrorMessage(roleMutation.error)}
        </p>
      )}

      <p className="text-xs text-muted-foreground">
        User deletion and account-status changes are not available on this
        page. Role changes are also validated by the backend.
      </p>
    </div>
  );
}