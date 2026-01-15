import { useState } from "react";
import Header from "@/components/Header";
import VoiceInput from "@/components/VoiceInput";
import TransactionForm from "@/components/TransactionForm";
import StatsCards from "@/components/StatsCards";
import CustomerSearch from "@/components/CustomerSearch";
import { useCreditEntries } from "@/hooks/useCreditEntries";
import { ParsedVoiceEntry } from "@/hooks/useVoiceInput";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mic, PenTool } from "lucide-react";

const Index = () => {
  const { entries, addEntry, isSaving } = useCreditEntries();
  // We can treat "form" as the manual entry, and "voice" as the new default
  const [activeTab, setActiveTab] = useState("voice");

  // Handle saving multiple entries from Voice Input
  const handleVoiceSave = async (voiceEntries: ParsedVoiceEntry[]) => {
    let successCount = 0;

    // Save sequentially to ensure order (optional, parallel is also fine)
    for (const entry of voiceEntries) {
      const success = await addEntry(entry.name, entry.amount);
      if (success) successCount++;
    }

    if (successCount > 0) {
      toast.success(`Successfully added ${successCount} entries!`);
      // Stay on voice tab for more input? Or switch?
      // Usually better to stay to allow next batch.
    }
  };

  const handleManualSave = async (name: string, amount: number) => {
    await addEntry(name, amount);
  };

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
                <TabsTrigger value="voice" className="flex items-center gap-2">
                  <Mic className="w-4 h-4" />
                  Voice Input
                </TabsTrigger>
                <TabsTrigger value="form" className="flex items-center gap-2">
                  <PenTool className="w-4 h-4" />
                  Manual Entry
                </TabsTrigger>
              </TabsList>

              <TabsContent value="voice">
                <VoiceInput onSave={handleVoiceSave} isSaving={isSaving} />
              </TabsContent>

              <TabsContent value="form">
                <TransactionForm
                  extractedData={null}
                  onSave={handleManualSave}
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
