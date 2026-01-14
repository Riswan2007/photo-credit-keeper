import { useState, useCallback, useRef } from "react";
import { Upload, Camera, Image as ImageIcon, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  isProcessing: boolean;
}

const ImageUpload = ({ onImageSelect, isProcessing }: ImageUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      processFile(file);
    }
  }, []);

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    onImageSelect(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const clearPreview = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="card-elevated p-6 animate-fade-in">
      <h2 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
        <Camera className="w-5 h-5 text-primary" />
        Upload Credit Photo
      </h2>

      {!preview ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "upload-zone p-8 text-center cursor-pointer",
            isDragging && "dragging"
          )}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 rounded-full bg-primary/10">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">
                Drop image here or tap to upload
              </p>
              <p className="text-sm text-muted-foreground">
                Take a photo of the credit note
              </p>
            </div>
            <Button variant="outline" size="sm" className="mt-2">
              <ImageIcon className="w-4 h-4 mr-2" />
              Choose Image
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative animate-scale-in">
          <img
            src={preview}
            alt="Credit note preview"
            className="w-full max-h-64 object-contain rounded-lg bg-secondary/30"
          />
          
          {isProcessing && (
            <div className="absolute inset-0 bg-background/80 rounded-lg flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-sm font-medium">Extracting text...</p>
              </div>
            </div>
          )}
          
          {!isProcessing && (
            <button
              onClick={clearPreview}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
