import { useEffect, useState } from "react";
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
    const [editableEntries, setEditableEntries] = useState<any[]>([]); // editable entries with string amounts

    // Sync parsed entries to editable state
    useEffect(() => {
        if (parsedEntries.length > 0) {
            setEditableEntries(parsedEntries.map(e => ({ ...e })));
        }
    }, [parsedEntries]);

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

    const handleEntryChange = (index: number, field: 'name' | 'amount', value: string) => {
        setEditableEntries(prev => {
            const updated = [...prev];
            if (field === 'amount') {
                updated[index][field] = value.replace(/[^0-9]/g, '');
            } else {
                updated[index][field] = value;
            }
            return updated;
        });
    };

    const handleDelete = (index: number) => {
        setEditableEntries(prev => prev.filter((_, i) => i !== index));
    };

    const handleSave = () => {
        if (editableEntries.length === 0) {
            toast.error("No valid entries found to save.");
            return;
        }
        // Convert amount to number and include originalText
        const finalEntries = editableEntries.map(e => ({
            name: e.name.trim(),
            amount: Number(e.amount),
            originalText: e.originalText ?? ""
        }));
        onSave(finalEntries);
        setEditableEntries([]);
        reset();
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
            {(transcript || editableEntries.length > 0) && (
                <div className="w-full max-w-md space-y-4 animate-in fade-in slide-in-from-bottom-4">

                    {/* Live Transcript */}
                    <div className="bg-muted/50 p-4 rounded-lg text-sm italic text-muted-foreground min-h-[60px] border border-dashed text-center">
                        {transcript || "..."}
                    </div>

                    {/* Editable Entries */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-foreground">Detected Entries ({editableEntries.length})</h4>
                            <Button variant="ghost" size="sm" onClick={reset} className="h-8 text-xs text-muted-foreground hover:text-foreground">
                                <RefreshCw className="mr-1 h-3 w-3" />
                                Clear
                            </Button>
                        </div>

                        {editableEntries.length === 0 && transcript.length > 10 && (
                            <p className="text-sm text-destructive text-center py-2">
                                Could not recognize names/amounts. Try speaking clearer.
                            </p>
                        )}

                        <div className="grid gap-2">
                            {editableEntries.map((entry, idx) => (
                                <Card key={idx} className="bg-card/50 border-primary/20 p-2">
                                    <CardContent className="p-2 flex items-center justify-between">
                                        <div className="flex flex-col gap-1 w-full">
                                            <input
                                                type="text"
                                                value={entry.name}
                                                onChange={e => handleEntryChange(idx, 'name', e.target.value)}
                                                className="border-b border-muted bg-transparent focus:outline-none text-base"
                                                placeholder="Name"
                                            />
                                            <input
                                                type="text"
                                                value={entry.amount}
                                                onChange={e => handleEntryChange(idx, 'amount', e.target.value)}
                                                className="border-b border-muted bg-transparent focus:outline-none text-base"
                                                placeholder="Amount"
                                            />
                                        </div>
                                        <Button variant="ghost" size="sm" onClick={() => handleDelete(idx)}>
                                            <RefreshCw className="h-4 w-4" />
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    <Button
                        className="w-full"
                        size="lg"
                        onClick={handleSave}
                        disabled={editableEntries.length === 0 || isSaving}
                    >
                        {isSaving ? "Saving..." : <><Save className="mr-2 h-4 w-4" />Save All Entries</>}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default VoiceInput;
