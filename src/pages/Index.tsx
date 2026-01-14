import { useState } from "react";
import Header from "@/components/Header";
import ImageUpload from "@/components/ImageUpload";
import TransactionForm from "@/components/TransactionForm";
import StatsCards from "@/components/StatsCards";
import CustomerSearch from "@/components/CustomerSearch";
import { useOCR } from "@/hooks/useOCR";
import { useCreditEntries } from "@/hooks/useCreditEntries";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, PenTool } from "lucide-react";

const Index = () => {
  const { extractText, isProcessing, extractedData, error, clearData } = useOCR();
  const { entries, addEntry, isSaving } = useCreditEntries();
  const [imageKey, setImageKey] = useState(0);
  const [activeTab, setActiveTab] = useState("scan");

  const handleImageSelect = async (file: File) => {
    setActiveTab("form"); // Switch to form tab after scan
    await extractText(file);
  };

  const handleSave = async (name: string, amount: number) => {
    const success = await addEntry(name, amount);
    if (success) {
      clearData();
      setImageKey((prev) => prev + 1);
      setActiveTab("scan"); // Reset to scan tab
    }
  };

  // Switch to form tab if extraction completes
  if (extractedData && activeTab !== "form") {
    setActiveTab("form");
  }

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
          {/* Left Column - Input Methods */}
          <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="scan" className="flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  Scan Bill
                </TabsTrigger>
                <TabsTrigger value="form" className="flex items-center gap-2">
                  <PenTool className="w-4 h-4" />
                  Enter Details
                </TabsTrigger>
              </TabsList>

              <TabsContent value="scan">
                <ImageUpload
                  key={imageKey}
                  onImageSelect={handleImageSelect}
                  isProcessing={isProcessing}
                />
                <p className="text-sm text-center text-muted-foreground mt-4">
                  Scanning will automatically fill the details in the "Enter Details" tab.
                </p>
              </TabsContent>

              <TabsContent value="form">
                <TransactionForm
                  extractedData={extractedData}
                  onSave={handleSave}
                  isSaving={isSaving}
                />
              </TabsContent>
            </Tabs>
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
