import { useState } from "react";
import Header from "@/components/Header";
import ImageUpload from "@/components/ImageUpload";
import ExtractedDataForm from "@/components/ExtractedDataForm";
import StatsCards from "@/components/StatsCards";
import CustomerSearch from "@/components/CustomerSearch";
import { useOCR } from "@/hooks/useOCR";
import { useCreditEntries } from "@/hooks/useCreditEntries";
import { toast } from "sonner";

const Index = () => {
  const { extractText, isProcessing, extractedData, error, clearData } = useOCR();
  const { entries, addEntry, isSaving } = useCreditEntries();
  const [imageKey, setImageKey] = useState(0);

  const handleImageSelect = async (file: File) => {
    await extractText(file);
  };

  const handleSave = async (name: string, amount: number) => {
    const success = await addEntry(name, amount);
    if (success) {
      clearData();
      setImageKey((prev) => prev + 1);
    }
  };

  // Show OCR error if any
  if (error) {
    toast.error(error);
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-6 space-y-6">
        {/* Stats Overview */}
        <StatsCards entries={entries} />

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Upload & Form */}
          <div className="space-y-6">
            <ImageUpload
              key={imageKey}
              onImageSelect={handleImageSelect}
              isProcessing={isProcessing}
            />
            
            <ExtractedDataForm
              extractedData={extractedData}
              onSave={handleSave}
              isSaving={isSaving}
            />
          </div>

          {/* Right Column - Search & History */}
          <CustomerSearch entries={entries} />
        </div>

        {/* Footer */}
        <footer className="text-center py-4 text-sm text-muted-foreground">
          <p>Credit Manager • Simple loan tracking for your shop</p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
