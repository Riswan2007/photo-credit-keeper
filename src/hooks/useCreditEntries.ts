import { useState, useCallback, useEffect } from "react";
import { CreditEntry } from "@/types/credit";
import { toast } from "sonner";

const STORAGE_KEY = "credit-entries";

export const useCreditEntries = () => {
  const [entries, setEntries] = useState<CreditEntry[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Load entries from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setEntries(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse stored entries:", e);
      }
    }
  }, []);

  // Save to localStorage whenever entries change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const addEntry = useCallback(async (customerName: string, amount: number) => {
    setIsSaving(true);
    
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newEntry: CreditEntry = {
        id: crypto.randomUUID(),
        date: new Date().toISOString().split("T")[0],
        customerName: customerName
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(" "),
        amount,
      };

      setEntries((prev) => [newEntry, ...prev]);
      toast.success("Credit entry saved successfully!", {
        description: `₹${amount.toLocaleString("en-IN")} for ${newEntry.customerName}`,
      });
      
      return true;
    } catch (error) {
      toast.error("Failed to save entry", {
        description: "Please try again",
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  }, []);

  return { entries, addEntry, isSaving };
};
