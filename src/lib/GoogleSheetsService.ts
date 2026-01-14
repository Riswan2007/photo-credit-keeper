import { CreditEntry } from "@/types/credit";

// TODO: REPLACE THIS WITH YOUR DEPLOYED GOOGLE APPS SCRIPT URL
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyroshk6e2c9pOScg46zqBiVSpvA-f8eclIiQg_wtz2k6LC5SLsb4k9WXZJii7vZCPXMA/exec";

export const GoogleSheetsService = {
    addEntry: async (entry: CreditEntry): Promise<boolean> => {
        try {
            // We use no-cors mode because Google Apps Script redirects responses, 
            // which can cause CORS issues even with proper headers in some environments.
            // Ideally, with correct headers, standard CORS works, but 'no-cors' is safer for fire-and-forget.
            // However, to check success, we try standard fetch first.

            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "text/plain;charset=utf-8", // text/plain avoids preflight OPTIONS in some cases
                },
                body: JSON.stringify(entry),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return true;
        } catch (error) {
            console.error("Error saving to Google Sheets:", error);
            return false;
        }
    },

    getEntries: async (): Promise<CreditEntry[]> => {
        try {
            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Validate data is array
            if (!Array.isArray(data)) {
                console.error("Received invalid data format from Google Sheets");
                return [];
            }

            return data as CreditEntry[];
        } catch (error) {
            console.error("Error fetching from Google Sheets:", error);
            return [];
        }
    }
};
