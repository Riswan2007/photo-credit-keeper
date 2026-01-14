import { useState, useEffect } from "react";
import { User, IndianRupee, Save, AlertCircle, Check, CreditCard, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExtractedData } from "@/types/credit";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TransactionFormProps {
    extractedData: ExtractedData | null;
    onSave: (name: string, amount: number) => void;
    isSaving: boolean;
}

const TransactionForm = ({ extractedData, onSave, isSaving }: TransactionFormProps) => {
    const [customerName, setCustomerName] = useState("");
    const [amount, setAmount] = useState("");
    const [type, setType] = useState<"credit" | "payment">("credit");
    const [errors, setErrors] = useState<{ name?: string; amount?: string }>({});

    useEffect(() => {
        if (extractedData) {
            setCustomerName(extractedData.customerName);
            setAmount(extractedData.amount);
            setType("credit"); // Default to credit for scanned bills
            setErrors({});
        }
    }, [extractedData]);

    const validate = () => {
        const newErrors: { name?: string; amount?: string } = {};

        if (!customerName.trim()) {
            newErrors.name = "Customer name is required";
        }

        const numAmount = parseFloat(amount);
        if (!amount || isNaN(numAmount) || numAmount <= 0) {
            newErrors.amount = "Enter a valid positive amount";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (validate()) {
            let finalAmount = parseFloat(amount);
            // If payment, convert to negative
            if (type === "payment") {
                finalAmount = -finalAmount;
            }
            onSave(customerName.trim(), finalAmount);

            // Clear form if not using extracted data (Manual mode)
            if (!extractedData) {
                setCustomerName("");
                setAmount("");
                setType("credit");
            }
        }
    };

    return (
        <div className="card-elevated p-6 animate-fade-in">
            <h2 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                Transaction Details
            </h2>

            {extractedData && extractedData.confidence < 0.7 && (
                <div className="mb-4 p-3 rounded-lg bg-warning/10 border border-warning/20 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-warning-foreground">
                        Low confidence extraction. Please verify details.
                    </p>
                </div>
            )}

            <div className="space-y-4">
                {/* Transaction Type Toggle */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-secondary rounded-lg">
                    <button
                        onClick={() => setType("credit")}
                        className={`flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all ${type === "credit"
                                ? "bg-background shadow text-destructive"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        <ArrowUpCircle className="w-4 h-4" />
                        Give Credit
                    </button>
                    <button
                        onClick={() => setType("payment")}
                        className={`flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all ${type === "payment"
                                ? "bg-background shadow text-green-600"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        <ArrowDownCircle className="w-4 h-4" />
                        Receive Payment
                    </button>
                </div>

                <div>
                    <Label htmlFor="customerName" className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        Customer Name
                    </Label>
                    <Input
                        id="customerName"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Enter customer name"
                        className={errors.name ? "border-destructive" : ""}
                    />
                    {errors.name && (
                        <p className="text-xs text-destructive mt-1">{errors.name}</p>
                    )}
                </div>

                <div>
                    <Label htmlFor="amount" className="flex items-center gap-2 mb-2">
                        <IndianRupee className="w-4 h-4 text-muted-foreground" />
                        Amount
                    </Label>
                    <Input
                        id="amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                        className={errors.amount ? "border-destructive" : ""}
                    />
                    {errors.amount && (
                        <p className="text-xs text-destructive mt-1">{errors.amount}</p>
                    )}
                </div>

                <Button
                    onClick={handleSave}
                    className={`w-full ${type === 'payment' ? 'bg-green-600 hover:bg-green-700' : 'btn-primary-glow'}`}
                    disabled={isSaving}
                >
                    {isSaving ? (
                        <>Saving...</>
                    ) : (
                        <>
                            <Save className="w-4 h-4 mr-2" />
                            {type === 'payment' ? 'Save Payment' : 'Save Credit Record'}
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
};

export default TransactionForm;
