import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FileText, Upload, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  getAdminResume,
  uploadAndActivateResume,
} from "@/features/portfolio/resumeApi";
import { getApiErrorMessage } from "@/lib/api/apiError";

export function ResumeManagerCard() {
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [localError, setLocalError] = useState("");

  const resumeQuery = useQuery({
    queryKey: ["admin", "resume"],
    queryFn: ({ signal }) => getAdminResume(signal),
  });

  const uploadMutation = useMutation({
    mutationFn: () => {
      if (!file) {
        throw new Error("Select a PDF file first.");
      }

      return uploadAndActivateResume(file);
    },
    onSuccess: async () => {
      setFile(null);
      setLocalError("");

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["admin", "resume"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["portfolio", "resume"],
        }),
      ]);
    },
  });

  function handleUpload() {
    setLocalError("");

    if (!file) {
      setLocalError("Please select a PDF resume.");
      return;
    }

    if (file.type !== "application/pdf") {
      setLocalError("Only PDF files are supported.");
      return;
    }

    if (file.size <= 0 || file.size > 5 * 1024 * 1024) {
      setLocalError("The PDF must not exceed 5 MB.");
      return;
    }

    uploadMutation.mutate();
  }

  const resume = resumeQuery.data;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="size-5" />
          Portfolio Resume
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Upload a new PDF to update the resume shown on the public portfolio.
        </p>

        {resumeQuery.isPending ? (
          <p className="text-sm text-muted-foreground">
            Loading current resume...
          </p>
        ) : resumeQuery.isError ? (
          <p role="alert" className="text-sm text-destructive">
            {getApiErrorMessage(resumeQuery.error)}
          </p>
        ) : resume ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3">
            <div>
              <p className="font-medium">Current active resume</p>
              <p className="text-xs text-muted-foreground">
                Updated {new Date(resume.updatedAt).toLocaleString()}
              </p>
            </div>

            <a
              href={resume.secureUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary"
            >
              View PDF <ExternalLink className="size-4" />
            </a>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No resume has been uploaded yet.
          </p>
        )}

        <Input
          type="file"
          accept="application/pdf,.pdf"
          onChange={(event) => {
            setFile(event.target.files?.[0] ?? null);
            setLocalError("");
          }}
          disabled={uploadMutation.isPending}
        />

        {file && (
          <p className="text-xs text-muted-foreground">
            Selected: {file.name}
          </p>
        )}

        {localError && (
          <p role="alert" className="text-sm text-destructive">
            {localError}
          </p>
        )}

        {uploadMutation.isError && (
          <p role="alert" className="text-sm text-destructive">
            {getApiErrorMessage(uploadMutation.error)}
          </p>
        )}

        {uploadMutation.isSuccess && (
          <p role="status" className="text-sm text-green-600">
            Resume updated successfully.
          </p>
        )}

        <Button
          onClick={handleUpload}
          disabled={!file || uploadMutation.isPending}
        >
          <Upload className="size-4" />
          {uploadMutation.isPending ? "Uploading..." : "Upload new resume"}
        </Button>
      </CardContent>
    </Card>
  );
}