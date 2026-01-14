import { Users, IndianRupee, TrendingUp, Calendar } from "lucide-react";
import { CreditEntry } from "@/types/credit";

interface StatsCardsProps {
  entries: CreditEntry[];
}

const StatsCards = ({ entries }: StatsCardsProps) => {
  const totalAmount = entries.reduce((sum, entry) => sum + entry.amount, 0);
  const uniqueCustomers = new Set(entries.map(e => e.customerName.toLowerCase())).size;
  const todayEntries = entries.filter(
    e => e.date === new Date().toISOString().split("T")[0]
  ).length;

  const stats = [
    {
      label: "Total Credit",
      value: `₹${totalAmount.toLocaleString("en-IN")}`,
      icon: IndianRupee,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Customers",
      value: uniqueCustomers.toString(),
      icon: Users,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      label: "Today's Entries",
      value: todayEntries.toString(),
      icon: Calendar,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      label: "Total Entries",
      value: entries.length.toString(),
      icon: TrendingUp,
      color: "text-muted-foreground",
      bgColor: "bg-secondary",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <div key={stat.label} className="stat-card animate-fade-in">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="font-heading font-semibold text-lg">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
