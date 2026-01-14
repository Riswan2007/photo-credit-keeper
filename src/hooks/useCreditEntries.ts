import { useState, useCallback, useEffect } from "react";
import { GoogleSheetsService } from "@/lib/GoogleSheetsService";
import { CreditEntry } from "@/types/credit";
import { toast } from "sonner";

export const useCreditEntries = () => {
  const [entries, setEntries] = useState<CreditEntry[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load entries from Google Sheets on mount
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        setIsLoading(true);
        const fetchedEntries = await GoogleSheetsService.getEntries();
        // Sort by date desc (optional, assuming new entries might be appended at end)
        setEntries(fetchedEntries.reverse());
      } catch (error) {
        toast.error("Failed to load records from cloud.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntries();
  }, []);

  const addEntry = useCallback(async (customerName: string, amount: number) => {
    setIsSaving(true);

    try {
      const newEntry: CreditEntry = {
        id: crypto.randomUUID(),
        date: new Date().toISOString().split("T")[0],
        customerName: customerName
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(" "),
        amount,
      };

      // Save to Google Sheets
      const success = await GoogleSheetsService.addEntry(newEntry);

      if (success) {
        setEntries((prev) => [newEntry, ...prev]);
        toast.success("Credit entry saved to Google Sheets!", {
          description: `₹${amount.toLocaleString("en-IN")} for ${newEntry.customerName}`,
        });
        return true;
      } else {
        throw new Error("Failed to save to cloud");
      }

    } catch (error) {
      toast.error("Failed to save entry", {
        description: "Please try again. Check your internet connection.",
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  }, []);

  return { entries, addEntry, isSaving, isLoading };
};
