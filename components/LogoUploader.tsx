"use client";

import { ourFileRouter } from "@/app/api/uploadthing/core";
import { UploadDropzone } from "@/lib/uploadthing";
import React from "react";
import { toast } from "sonner";

interface LogoUploaderProps {
  endpoint: keyof typeof ourFileRouter;
  onChange: (url?: string) => void;
}

const LogoUploader = ({ endpoint, onChange }: LogoUploaderProps) => {
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        console.log(res);

        onChange(res?.[0].url);
      }}
      onUploadError={(error: Error) => {
        toast(error.message, { position: "top-center" });
      }}
    />
  );
};

export default LogoUploader;
