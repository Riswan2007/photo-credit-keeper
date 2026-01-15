import { useState, useCallback, useEffect } from "react";

// Web Speech API type definitions
interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start: () => void;
    stop: () => void;
    abort: () => void;
    onresult: (event: SpeechRecognitionEvent) => void;
    onerror: (event: SpeechRecognitionErrorEvent) => void;
    onend: () => void;
}

interface SpeechRecognitionEvent {
    results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
    length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
    isFinal: boolean;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
    error: string;
}

// Window augmentation
declare global {
    interface Window {
        SpeechRecognition: {
            new(): SpeechRecognition;
        };
        webkitSpeechRecognition: {
            new(): SpeechRecognition;
        };
    }
}

export interface ParsedVoiceEntry {
    name: string;
    amount: number;
    originalText: string;
}

export const useVoiceInput = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Initialize SpeechRecognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (SpeechRecognition) {
            const recognitionInstance = new SpeechRecognition();
            recognitionInstance.continuous = true;
            recognitionInstance.interimResults = false;
            recognitionInstance.lang = "en-US"; // Default to English, capable of picking up names

            recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
                let currentTranscript = "";
                for (let i = 0; i < event.results.length; i++) {
                    currentTranscript += event.results[i][0].transcript;
                }
                setTranscript(currentTranscript);
            };

            recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
                console.error("Speech Recognition Error", event.error);
                setError("Microphone access blocked or disconnected.");
                setIsListening(false);
            };

            recognitionInstance.onend = () => {
                setIsListening(false);
            };

            setRecognition(recognitionInstance);
        } else {
            setError("Your browser does not support Voice Recognition.");
        }
    }, []);

    const startListening = useCallback(() => {
        if (recognition) {
            setTranscript(""); // Clear previous
            try {
                recognition.start();
                setIsListening(true);
                setError(null);
            } catch (e) {
                console.error(e);
            }
        }
    }, [recognition]);

    const stopListening = useCallback(() => {
        if (recognition) {
            recognition.stop();
            setIsListening(false);
        }
    }, [recognition]);

    const parseTranscript = useCallback((text: string): ParsedVoiceEntry[] => {
        if (!text) return [];

        // Split by "next" keyword (case insensitive)
        const segments = text.split(/next/i);
        const entries: ParsedVoiceEntry[] = [];

        segments.forEach((segment) => {
            const trimmed = segment.trim();
            if (!trimmed) return;

            // Logic: Look for Number (Amount) and Text (Name)
            // Usually "Name Amount" or "Amount Name"

            // Extract first number found
            const numberMatch = trimmed.match(/(\d+)/);

            if (numberMatch) {
                const amount = parseInt(numberMatch[0], 10);

                // Remove the number from the string to get the name
                let name = trimmed.replace(numberMatch[0], "").trim();

                // Clean up noise
                name = name.replace(/[^a-zA-Z\s]/g, "").trim();

                if (name && amount) {
                    entries.push({
                        name,
                        amount,
                        originalText: trimmed
                    });
                }
            }
        });

        return entries;
    }, []);

    return {
        isListening,
        transcript,
        parsedEntries: parseTranscript(transcript),
        startListening,
        stopListening,
        reset: () => setTranscript(""),
        error
    };
};
