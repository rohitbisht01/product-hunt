import { ourFileRouter } from "@/app/api/uploadthing/core";
import { UploadDropzone } from "@/lib/uploadthing";
import { toast } from "sonner";

interface ImagesUploaderProps {
  endpoint: keyof typeof ourFileRouter;
  onChange: (urls?: string[]) => void;
}

const ImagesUploader = ({ endpoint, onChange }: ImagesUploaderProps) => {
  const handleUploadComplete = (res: { url: string }[]) => {
    const urls = res.map((item) => item.url);
    onChange(urls);
  };

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={handleUploadComplete}
      onUploadError={(error: Error) => {
        toast(error.message, { position: "top-center" });
      }}
    />
  );
};

export default ImagesUploader;
