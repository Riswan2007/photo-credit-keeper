export interface CreditEntry {
  id: string;
  date: string;
  customerName: string;
  amount: number;
}

export interface CustomerSummary {
  name: string;
  totalAmount: number;
  entries: CreditEntry[];
}

export interface ExtractedData {
  customerName: string;
  amount: string;
  confidence: number;
}
