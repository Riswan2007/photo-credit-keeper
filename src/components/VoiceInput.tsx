import { useEffect } from "react";
import { Mic, MicOff, Save, Check, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useVoiceInput, ParsedVoiceEntry } from "@/hooks/useVoiceInput";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface VoiceInputProps {
    onSave: (entries: ParsedVoiceEntry[]) => void;
    isSaving: boolean;
}

const VoiceInput = ({ onSave, isSaving }: VoiceInputProps) => {
    const { isListening, transcript, parsedEntries, startListening, stopListening, reset, error } = useVoiceInput();

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const handleToggle = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    const handleSave = () => {
        if (parsedEntries.length === 0) {
            toast.error("No valid entries found to save.");
            return;
        }
        onSave(parsedEntries);
    };

    return (
        <div className="space-y-6 flex flex-col items-center">
            {/* Mic Button */}
            <div className="relative">
                <Button
                    variant={isListening ? "destructive" : "default"}
                    size="lg"
                    className={cn(
                        "h-24 w-24 rounded-full transition-all duration-300 shadow-xl",
                        isListening && "animate-pulse ring-4 ring-destructive/30"
                    )}
                    onClick={handleToggle}
                >
                    {isListening ? (
                        <MicOff className="h-10 w-10" />
                    ) : (
                        <Mic className="h-10 w-10" />
                    )}
                </Button>
            </div>

            <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold">
                    {isListening ? "Listening..." : "Tap to Speak"}
                </h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                    Say "Customer Name [Amount] next..." <br />
                    Example: <i>"Amir 50 next Riswan 20"</i>
                </p>
            </div>

            {/* Transcript Preview */}
            {(transcript || parsedEntries.length > 0) && (
                <div className="w-full max-w-md space-y-4 animate-in fade-in slide-in-from-bottom-4">

                    {/* Live Transcript */}
                    <div className="bg-muted/50 p-4 rounded-lg text-sm italic text-muted-foreground min-h-[60px] border border-dashed text-center">
                        "{transcript || "..."}"
                    </div>

                    {/* Parsed Entries Results */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-foreground">Detected Entries ({parsedEntries.length})</h4>
                            <Button variant="ghost" size="sm" onClick={reset} className="h-8 text-xs text-muted-foreground hover:text-foreground">
                                <RefreshCw className="mr-1 h-3 w-3" />
                                Clear
                            </Button>
                        </div>

                        {parsedEntries.length === 0 && transcript.length > 10 && (
                            <p className="text-sm text-destructive text-center py-2">
                                Could not recognize names/amounts. Try speaking clearer.
                            </p>
                        )}

                        <div className="grid gap-2">
                            {parsedEntries.map((entry, idx) => (
                                <Card key={idx} className="bg-card/50 border-primary/20">
                                    <CardContent className="p-3 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-primary/10 p-2 rounded-full">
                                                <Check className="h-4 w-4 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium capitalize">{entry.name}</p>
                                                <p className="text-xs text-muted-foreground">Original: "{entry.originalText}"</p>
                                            </div>
                                        </div>
                                        <span className="text-lg font-bold">₹{entry.amount}</span>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    <Button
                        className="w-full"
                        size="lg"
                        onClick={handleSave}
                        disabled={parsedEntries.length === 0 || isSaving}
                    >
                        {isSaving ? (
                            "Saving..."
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Save All Entries
                            </>
                        )}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default VoiceInput;
