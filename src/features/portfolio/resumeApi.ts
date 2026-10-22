import axios from "axios";
import type { ApiSuccessResponse } from "@/contracts/api";
import { axiosClient } from "@/lib/api/axiosClient";

export interface ActiveResume {
  secureUrl: string;
  updatedAt: string;
}

export interface AdminResume extends ActiveResume {
  publicId: string;
}

interface ResumeUploadSignature {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  folder: string;
  publicId: string;
  allowedFormats: string;
  resourceType: "raw";
  signature: string;
}

export async function getActiveResume(
  signal?: AbortSignal,
): Promise<ActiveResume | null> {
  const response = await axiosClient.get<
    ApiSuccessResponse<ActiveResume | null>
  >("/resume", { signal });

  return response.data.data;
}

export async function getAdminResume(
  signal?: AbortSignal,
): Promise<AdminResume | null> {
  const response = await axiosClient.get<
    ApiSuccessResponse<AdminResume | null>
  >("/admin/resume", { signal });

  return response.data.data;
}

export async function uploadAndActivateResume(
  file: File,
): Promise<ActiveResume> {
  if (file.type !== "application/pdf") {
    throw new Error("Please select a PDF file.");
  }

  if (file.size <= 0 || file.size > 5 * 1024 * 1024) {
    throw new Error("Resume must not exceed 5 MB.");
  }

  const signatureResponse = await axiosClient.post<
    ApiSuccessResponse<ResumeUploadSignature>
  >("/admin/resume/upload-signature");

  const signature = signatureResponse.data.data;

  const formData = new FormData();

  formData.append("file", file);
  formData.append("api_key", signature.apiKey);
  formData.append("timestamp", String(signature.timestamp));
  formData.append("folder", signature.folder);
  formData.append("public_id", signature.publicId);
  formData.append("allowed_formats", signature.allowedFormats);
  formData.append("signature", signature.signature);

  const uploadResponse = await axios.post<{
    secure_url: string;
    public_id: string;
  }>(
    `https://api.cloudinary.com/v1_1/${signature.cloudName}/raw/upload`,
    formData,
  );

  const activationResponse = await axiosClient.post<
    ApiSuccessResponse<ActiveResume>
  >("/admin/resume/activate", {
    secureUrl: uploadResponse.data.secure_url,
    publicId: uploadResponse.data.public_id,
  });

  return activationResponse.data.data;
}