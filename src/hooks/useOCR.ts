import { useState, useCallback } from "react";
import { ExtractedData } from "@/types/credit";
import Tesseract from "tesseract.js";

export const useOCR = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const extractText = useCallback(async (imageFile: File) => {
    setIsProcessing(true);
    setError(null);
    setExtractedData(null);

    try {
      const result = await Tesseract.recognize(imageFile, "eng", {
        logger: (m) => console.log(m),
      });

      const text = result.data.text;
      const confidence = result.data.confidence / 100;

      // Parse the extracted text to find name and amount
      const parsed = parseExtractedText(text);

      setExtractedData({
        customerName: parsed.name,
        amount: parsed.amount,
        confidence,
      });
    } catch (err) {
      console.error("OCR Error:", err);
      setError("Failed to extract text from image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const clearData = useCallback(() => {
    setExtractedData(null);
    setError(null);
  }, []);

  return { extractText, isProcessing, extractedData, error, clearData };
};

function parseExtractedText(text: string): { name: string; amount: string } {
  const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);
  
  let name = "";
  let amount = "";

  // Look for amount patterns (numbers with optional currency symbols)
  const amountPatterns = [
    /(?:rs\.?|₹|inr)\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/i,
    /(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:rs\.?|₹|rupees?)/i,
    /(?:amount|loan|credit)[\s:]*(?:rs\.?|₹)?\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/i,
    /(\d+(?:,\d{3})*(?:\.\d{2})?)/,
  ];

  for (const line of lines) {
    for (const pattern of amountPatterns) {
      const match = line.match(pattern);
      if (match && !amount) {
        amount = match[1].replace(/,/g, "");
        break;
      }
    }
  }

  // Look for name patterns
  const namePatterns = [
    /(?:name|customer|to|mr\.?|mrs\.?|ms\.?)[\s:]+([a-z\s]+)/i,
    /^([a-z][a-z\s]{2,30})$/i,
  ];

  for (const line of lines) {
    // Skip lines that look like amounts
    if (/^\d+$/.test(line.replace(/[,.\s₹]/g, ""))) continue;
    
    for (const pattern of namePatterns) {
      const match = line.match(pattern);
      if (match && !name) {
        name = match[1].trim();
        // Clean up the name
        name = name.replace(/[^a-zA-Z\s]/g, "").trim();
        if (name.length > 2 && name.length < 50) {
          break;
        } else {
          name = "";
        }
      }
    }
    if (name) break;
  }

  // If no name found, use first alphabetic line
  if (!name) {
    for (const line of lines) {
      const cleaned = line.replace(/[^a-zA-Z\s]/g, "").trim();
      if (cleaned.length > 2 && cleaned.length < 50 && /^[a-zA-Z\s]+$/.test(cleaned)) {
        name = cleaned;
        break;
      }
    }
  }

  return { name, amount };
}
