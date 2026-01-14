import { CreditEntry } from "@/types/credit";

// TODO: REPLACE THIS WITH YOUR DEPLOYED GOOGLE APPS SCRIPT URL
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyroshk6e2c9pOScg46zqBiVSpvA-f8eclIiQg_wtz2k6LC5SLsb4k9WXZJii7vZCPXMA/exec";

export const GoogleSheetsService = {
    addEntry: async (entry: CreditEntry): Promise<boolean> => {
        try {
            // We use no-cors mode strictly to avoid browser blocking.
            // In this mode, we cannot read the response status (it is opaque),
            // so we assume success if the fetch call doesn't throw a network error.
            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: "POST",
                mode: "no-cors",
                headers: {
                    "Content-Type": "text/plain;charset=utf-8",
                },
                body: JSON.stringify(entry),
            });

            // With no-cors, we can't check response.ok. It will always appear 'opaque'.
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
