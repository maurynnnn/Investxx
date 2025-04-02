import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface DetailItem {
  label: string;
  value: string;
  isPositive?: boolean;
}

interface SummaryCardProps {
  title: string;
  icon: string;
  amount: number;
  isPositive?: boolean;
  details: DetailItem[];
}

export default function SummaryCard({ 
  title, 
  icon, 
  amount, 
  isPositive = false, 
  details 
}: SummaryCardProps) {
  return (
    <Card className="backdrop-blur-md bg-dark-card/75 border-dark-border shadow p-5 hover:shadow-glow transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-light-subtext">{title}</h2>
        <i className={`${icon} text-secondary`}></i>
      </div>
      <div className="mt-2 flex items-baseline">
        <p className={`text-2xl font-semibold ${isPositive ? 'text-positive' : 'text-light-text'}`}>
          {formatCurrency(amount)}
        </p>
      </div>
      <div className="mt-4">
        {details.map((detail, index) => (
          <div key={index} className="flex items-center justify-between text-sm mt-1">
            <span className="text-light-subtext">{detail.label}</span>
            <span className={`font-medium ${detail.isPositive ? 'text-positive' : 'text-light-text'}`}>
              {detail.value}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
