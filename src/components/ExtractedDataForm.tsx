import { useState, useEffect } from "react";
import { User, IndianRupee, Save, AlertCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExtractedData } from "@/types/credit";

interface ExtractedDataFormProps {
  extractedData: ExtractedData | null;
  onSave: (name: string, amount: number) => void;
  isSaving: boolean;
}

const ExtractedDataForm = ({ extractedData, onSave, isSaving }: ExtractedDataFormProps) => {
  const [customerName, setCustomerName] = useState("");
  const [amount, setAmount] = useState("");
  const [errors, setErrors] = useState<{ name?: string; amount?: string }>({});

  useEffect(() => {
    if (extractedData) {
      setCustomerName(extractedData.customerName);
      setAmount(extractedData.amount);
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
      newErrors.amount = "Enter a valid amount";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      onSave(customerName.trim(), parseFloat(amount));
    }
  };

  if (!extractedData) {
    return null;
  }

  return (
    <div className="card-elevated p-6 animate-fade-in">
      <h2 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
        <Check className="w-5 h-5 text-success" />
        Extracted Details
      </h2>

      {extractedData.confidence < 0.7 && (
        <div className="mb-4 p-3 rounded-lg bg-warning/10 border border-warning/20 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
          <p className="text-sm text-warning-foreground">
            Low confidence extraction. Please verify and correct the details.
          </p>
        </div>
      )}

      <div className="space-y-4">
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
            Loan Amount
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
          className="w-full btn-primary-glow"
          disabled={isSaving}
        >
          {isSaving ? (
            <>Saving...</>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save to Records
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ExtractedDataForm;
