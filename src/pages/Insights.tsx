import { useMemo } from "react";
import { format, parseISO } from "date-fns";
import {
  TrendingUp,
  Award,
  IndianRupee,
  Lightbulb,
  BarChart3,
  ShieldCheck,
  User as UserIcon,
} from "lucide-react";

import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useStore } from "@/store/useStore";

export default function Insights() {
  const { transactions, role } = useStore();


  const expenses = useMemo(
    () => transactions.filter((t) => t.type === "expense"),
    [transactions]
  );

  const highestCategory = useMemo(() => {
    const cats: Record<string, number> = {};
    expenses.forEach((t) => {
      cats[t.category] = (cats[t.category] || 0) + t.amount;
    });
    const sorted = Object.entries(cats).sort((a, b) => b[1] - a[1]);
    return sorted[0] ? { name: sorted[0][0], amount: sorted[0][1] } : null;
  }, [expenses]);

  const monthlyComparison = useMemo(() => {
    const months: Record<string, { income: number; expenses: number }> = {};
    transactions.forEach((t) => {
      const key = format(parseISO(t.date), "MMM");
      if (!months[key]) months[key] = { income: 0, expenses: 0 };
      if (t.type === "income") months[key].income += t.amount;
      else months[key].expenses += t.amount;
    });
    // Preserve chronological order
    const seen = new Set<string>();
    const ordered: string[] = [];
    [...transactions].sort((a, b) => a.date.localeCompare(b.date)).forEach((t) => {
      const key = format(parseISO(t.date), "MMM");
      if (!seen.has(key)) { seen.add(key); ordered.push(key); }
    });
    return ordered.map((month) => ({
      month,
      income: Math.round(months[month].income),
      expenses: Math.round(months[month].expenses),
    }));
  }, [transactions]);

  const topExpenses = useMemo(
    () =>
      [...expenses]
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 3),
    [expenses]
  );

  const avgDailySpending = useMemo(() => {
    if (!expenses.length) return 0;
    const dates = expenses.map((t) => parseISO(t.date).getTime());
    const minDate = Math.min(...dates);
    const maxDate = Math.max(...dates);
    const days = Math.max(1, (maxDate - minDate) / (1000 * 60 * 60 * 24));
    const total = expenses.reduce((s, t) => s + t.amount, 0);
    return total / days;
  }, [expenses]);

  const observation = useMemo(() => {
    if (!highestCategory) return null;
    const totalExp = expenses.reduce((s, t) => s + t.amount, 0);
    const pct = ((highestCategory.amount / totalExp) * 100).toFixed(0);
    return `${highestCategory.name} makes up ${pct}% of your total spending. Consider reviewing this category for potential savings.`;
  }, [highestCategory, expenses]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Financial Intelligence</h1>
          <p className="text-muted-foreground text-sm">
            Deep dive into your spending habits and patterns
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={role === "admin" ? "default" : "outline"} className="px-3 py-1 text-xs gap-1.5 h-7">
            {role === "admin" ? <ShieldCheck className="h-3.5 w-3.5" /> : <UserIcon className="h-3.5 w-3.5" />}
            {role.charAt(0).toUpperCase() + role.slice(1)} Mode
          </Badge>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Highest Spending Category
            </CardTitle>
            <Award className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {highestCategory?.name ?? "N/A"}
            </div>
            <p className="text-sm text-muted-foreground">
              {highestCategory ? formatCurrency(highestCategory.amount) : formatCurrency(0)}
            </p>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg. Daily Spending
            </CardTitle>
            <IndianRupee className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(avgDailySpending)}
            </div>
            <p className="text-sm text-muted-foreground">Based on last 6 months</p>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-md sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Top 3 Expenses
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {topExpenses.map((t, i) => (
                <div key={t.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground truncate mr-2">
                    {i + 1}. {t.description}
                  </span>
                  <span className="font-semibold text-red-500 shrink-0">
                    {formatCurrency(t.amount)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Comparison */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Monthly Comparison</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              income: { label: "Income", color: "hsl(142, 71%, 45%)" },
              expenses: { label: "Expenses", color: "hsl(0, 84%, 60%)" },
            }}
            className="h-[300px]"
          >
            <BarChart data={monthlyComparison}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="income" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" fill="hsl(0, 84%, 60%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Observation */}
      {observation && (
        <Card className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30">
          <CardContent className="flex items-start gap-3 pt-6">
            <Lightbulb className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm">Spending Observation</p>
              <p className="text-sm text-muted-foreground mt-1">{observation}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
