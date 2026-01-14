import { CreditCard, Wallet } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-card border-b border-border/50 sticky top-0 z-50 backdrop-blur-sm bg-card/95">
      <div className="container py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <Wallet className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-xl text-foreground">
              Credit Manager
            </h1>
            <p className="text-xs text-muted-foreground">
              Simple loan tracking for your shop
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
