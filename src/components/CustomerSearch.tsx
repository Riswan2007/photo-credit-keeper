import { useState, useMemo } from "react";
import { Search, X, User, Calendar, IndianRupee, ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CreditEntry, CustomerSummary } from "@/types/credit";
import { cn } from "@/lib/utils";

interface CustomerSearchProps {
  entries: CreditEntry[];
}

const CustomerSearch = ({ entries }: CustomerSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCustomer, setExpandedCustomer] = useState<string | null>(null);

  const customerSummaries = useMemo(() => {
    const summaryMap = new Map<string, CustomerSummary>();
    
    entries.forEach((entry) => {
      const key = entry.customerName.toLowerCase();
      const existing = summaryMap.get(key);
      
      if (existing) {
        existing.totalAmount += entry.amount;
        existing.entries.push(entry);
      } else {
        summaryMap.set(key, {
          name: entry.customerName,
          totalAmount: entry.amount,
          entries: [entry],
        });
      }
    });

    return Array.from(summaryMap.values()).sort((a, b) => 
      b.totalAmount - a.totalAmount
    );
  }, [entries]);

  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) return customerSummaries;
    
    const query = searchQuery.toLowerCase();
    return customerSummaries.filter((customer) =>
      customer.name.toLowerCase().includes(query)
    );
  }, [customerSummaries, searchQuery]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="card-elevated p-6 animate-fade-in">
      <h2 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
        <Search className="w-5 h-5 text-primary" />
        Search Customers
      </h2>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by customer name..."
          className="pl-9 pr-9 input-search"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <User className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No records yet</p>
          <p className="text-sm">Upload a credit photo to get started</p>
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No customers found</p>
          <p className="text-sm">Try a different search term</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {filteredCustomers.map((customer) => (
            <div
              key={customer.name}
              className="customer-row border border-border/50"
            >
              <button
                onClick={() =>
                  setExpandedCustomer(
                    expandedCustomer === customer.name ? null : customer.name
                  )
                }
                className="w-full p-4 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{customer.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {customer.entries.length} entries
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-heading font-semibold text-primary">
                      ₹{customer.totalAmount.toLocaleString("en-IN")}
                    </p>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                  {expandedCustomer === customer.name ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </button>

              {expandedCustomer === customer.name && (
                <div className="px-4 pb-4 animate-fade-in">
                  <div className="bg-secondary/50 rounded-lg p-3 space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                      Transaction History
                    </p>
                    {customer.entries
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((entry) => (
                        <div
                          key={entry.id}
                          className="flex items-center justify-between py-2 border-b border-border/30 last:border-0"
                        >
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3 text-muted-foreground" />
                            <span className="text-sm">{formatDate(entry.date)}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm font-medium">
                            <IndianRupee className="w-3 h-3" />
                            {entry.amount.toLocaleString("en-IN")}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerSearch;
