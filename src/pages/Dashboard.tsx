import { useMemo } from "react";
import {
  IndianRupee,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  User as UserIcon,
} from "lucide-react";


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useStore } from "@/store/useStore";
import { format, parseISO } from "date-fns";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";




const COLORS = [
  "#6366f1", // Indigo
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#3b82f6", // Blue
  "#8b5cf6", // Violet
  "#ec4899", // Pink
];

export default function Dashboard() {
  const { transactions, role } = useStore();

  const { totalIncome, totalExpenses, balance, savingsRate } = useMemo(() => {
    const inc = transactions
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + t.amount, 0);
    const exp = transactions
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);
    return {
      totalIncome: inc,
      totalExpenses: exp,
      balance: inc - exp,
      savingsRate: inc > 0 ? ((inc - exp) / inc) * 100 : 0,
    };
  }, [transactions]);

  const balanceTrend = useMemo(() => {
    const months: Record<string, { income: number; expense: number }> = {};
    transactions.forEach((t) => {
      const key = format(parseISO(t.date), "MMM yyyy");
      if (!months[key]) months[key] = { income: 0, expense: 0 };
      if (t.type === "income") months[key].income += t.amount;
      else months[key].expense += t.amount;
    });
    let running = 0;
    return Object.entries(months)
      .reverse()
      .map(([month, data]) => {
        running += data.income - data.expense;
        return { month: month.split(" ")[0], balance: Math.round(running) };
      });
  }, [transactions]);

  const spendingBreakdown = useMemo(() => {
    const cats: Record<string, number> = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        cats[t.category] = (cats[t.category] || 0) + t.amount;
      });
    return Object.entries(cats)
      .map(([name, value]) => ({ name, value: Math.round(value) }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const recentTransactions = useMemo(
    () => [...transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5),
    [transactions]
  );

  const summaryCards = [
    {
      title: "Total Balance",
      value: balance,
      icon: IndianRupee,
      trend: balance >= 0,
      color: "text-primary",
    },
    {
      title: "Income",
      value: totalIncome,
      icon: TrendingUp,
      trend: true,
      color: "text-emerald-500",
    },
    {
      title: "Expenses",
      value: totalExpenses,
      icon: TrendingDown,
      trend: false,
      color: "text-red-500",
    },
    {
      title: "Savings Rate",
      value: savingsRate,
      icon: PiggyBank,
      trend: savingsRate > 20,
      iPercent: true,
      color: "text-amber-500",
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Financial Overview</h1>
          <p className="text-muted-foreground text-sm">Real-time wealth tracking & performance analytics</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={role === "admin" ? "default" : "outline"} className="px-3 py-1 text-xs gap-1.5 h-7">
            {role === "admin" ? (
              <ShieldCheck className="h-3.5 w-3.5" />
            ) : (
              <UserIcon className="h-3.5 w-3.5" />
            )}
            {role.charAt(0).toUpperCase() + role.slice(1)} Mode
          </Badge>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, i) => (
          <Card key={card.title} className="glass-card hover:scale-[1.03] transition-all duration-500 overflow-hidden group relative border-none">
            <div className={`absolute top-0 left-0 w-full h-1 bg-primary/20 group-hover:bg-primary transition-colors`} />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                {card.title}
              </CardTitle>
              <div className="p-2 rounded-xl bg-primary/5 group-hover:bg-primary/10 transition-colors">
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">
                {card.iPercent
                  ? `${card.value.toFixed(1)}%`
                  : formatCurrency(card.value)}
              </div>
              <div className="flex items-center mt-1">
                {card.trend ? (
                  <ArrowUpRight className="h-4 w-4 text-emerald-500 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                )}
                <p className={`text-[10px] font-semibold ${card.trend ? "text-emerald-500" : "text-red-500 uppercase tracking-wider"}`}>
                  6-Month Performance
                </p>
              </div>
            </CardContent>
            <div className="absolute -bottom-6 -right-6 h-20 w-20 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-500" />
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Balance Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Balance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                balance: { label: "Balance", color: "hsl(221, 83%, 53%)" },
              }}
              className="h-[250px]"
            >
              <LineChart data={balanceTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="balance"
                  stroke="hsl(221, 83%, 53%)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Spending Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Spending Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] flex items-center">
              <ResponsiveContainer width="50%" height="100%">
                <PieChart>
                  <Pie
                    data={spendingBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    dataKey="value"
                    paddingAngle={2}
                  >
                    {spendingBreakdown.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [formatCurrency(value), '']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2 text-sm">
                {spendingBreakdown.map((item, i) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-sm shrink-0"
                      style={{ backgroundColor: COLORS[i % COLORS.length] }}
                    />
                    <span className="text-muted-foreground truncate">{item.name}</span>
                    <span className="ml-auto font-medium">{formatCurrency(item.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentTransactions.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div>
                  <p className="font-medium text-sm">{t.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.category} · {format(parseISO(t.date), "MMM d, yyyy")}
                  </p>
                </div>
                <span
                  className={`font-semibold text-sm ${
                    t.type === "income" ? "text-emerald-500" : "text-red-500"
                  }`}
                >
                  {t.type === "income" ? "+" : "-"}
                  {formatCurrency(t.amount)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
