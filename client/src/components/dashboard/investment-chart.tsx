import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const weekData = [
  { name: "Seg", value: 2500 },
  { name: "Ter", value: 3000 },
  { name: "Qua", value: 3800 },
  { name: "Qui", value: 4200 },
  { name: "Sex", value: 4800 },
  { name: "Sáb", value: 5500 },
  { name: "Dom", value: 6000 },
];

const monthData = [
  { name: "Semana 1", value: 6000 },
  { name: "Semana 2", value: 8500 },
  { name: "Semana 3", value: 11000 },
  { name: "Semana 4", value: 14500 },
];

const yearData = [
  { name: "Jan", value: 15000 },
  { name: "Fev", value: 22000 },
  { name: "Mar", value: 30000 },
  { name: "Abr", value: 38000 },
  { name: "Mai", value: 45000 },
  { name: "Jun", value: 55000 },
  { name: "Jul", value: 65000 },
  { name: "Ago", value: 78000 },
  { name: "Set", value: 92000 },
  { name: "Out", value: 108000 },
  { name: "Nov", value: 125000 },
  { name: "Dez", value: 145000 },
];

type PeriodType = "week" | "month" | "year";

export default function InvestmentChart() {
  const [period, setPeriod] = useState<PeriodType>("week");
  
  const handlePeriodChange = (newPeriod: PeriodType) => {
    setPeriod(newPeriod);
  };
  
  const data = {
    week: weekData,
    month: monthData,
    year: yearData
  }[period];
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card className="backdrop-blur-md bg-dark-card/75 border-dark-border shadow">
      <CardContent className="p-5">
        <div className="flex flex-wrap items-center justify-between mb-4">
          <h2 className="text-lg font-display font-medium text-light-text">Desempenho dos Investimentos</h2>
          <div className="flex items-center mt-2 sm:mt-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePeriodChange("week")}
              className={`rounded-lg mr-2 ${
                period === "week" 
                  ? "bg-primary/20 text-primary" 
                  : "bg-dark-surface text-light-subtext"
              }`}
            >
              Semana
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePeriodChange("month")}
              className={`rounded-lg mr-2 ${
                period === "month" 
                  ? "bg-primary/20 text-primary" 
                  : "bg-dark-surface text-light-subtext"
              }`}
            >
              Mês
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePeriodChange("year")}
              className={`rounded-lg ${
                period === "year" 
                  ? "bg-primary/20 text-primary" 
                  : "bg-dark-surface text-light-subtext"
              }`}
            >
              Ano
            </Button>
          </div>
        </div>
        
        <div className="w-full h-64 bg-dark-surface rounded-xl p-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(61, 61, 61, 0.5)" />
              <XAxis 
                dataKey="name" 
                stroke="#B0B0B0" 
                fontSize={12} 
                tickLine={false} 
                axisLine={{ stroke: 'rgba(61, 61, 61, 0.5)' }} 
              />
              <YAxis 
                stroke="#B0B0B0" 
                fontSize={12} 
                tickFormatter={formatCurrency} 
                tickLine={false} 
                axisLine={{ stroke: 'rgba(61, 61, 61, 0.5)' }} 
              />
              <Tooltip 
                formatter={(value: number) => [formatCurrency(value), 'Rendimento']} 
                contentStyle={{ backgroundColor: '#2D2D2D', borderColor: '#3D3D3D', borderRadius: '8px' }}
                itemStyle={{ color: '#F7F7F7' }}
                labelStyle={{ color: '#B0B0B0' }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="url(#colorGradient)" 
                strokeWidth={2}
                fill="url(#colorGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 flex items-center justify-end">
          <div className="flex items-center mr-4">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-primary to-secondary mr-2"></div>
            <span className="text-xs text-light-subtext">Rendimentos</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-dark-border mr-2"></div>
            <span className="text-xs text-light-subtext">Projeção</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
