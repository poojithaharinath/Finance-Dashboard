import { Transaction, Category, TransactionType } from "./types";

const categories: { category: Category; type: TransactionType }[] = [
  { category: "Food", type: "expense" },
  { category: "Transport", type: "expense" },
  { category: "Shopping", type: "expense" },
  { category: "Bills", type: "expense" },
  { category: "Entertainment", type: "expense" },
  { category: "Healthcare", type: "expense" },
  { category: "Education", type: "expense" },
  { category: "Salary", type: "income" },
  { category: "Freelance", type: "income" },
  { category: "Investment", type: "income" },
];

const descriptions: Record<Category, string[]> = {
  Food: ["BigBasket Grocery", "Zomato Dinner", "Blue Tokai Coffee", "Swiggy Order", "Darshini Breakfast"],
  Transport: ["BPC Petrol", "Uber Auto", "Metro Smart Card", "Car Service", "Parking Charges"],
  Shopping: ["Amazon India", "Myntra Order", "Reliance Digital", "FabIndia", "Flipkart Purchase"],
  Bills: ["BESCOM Bill", "Airtel Fiber", "Jio Recharge", "BWSSB Water", "HDFC Life Insurance"],
  Entertainment: ["PVR Tickets", "Zomato Concert", "Hotstar Subscription", "Steam Gaming", "YouTube Premium"],
  Salary: ["Net Monthly Pay", "Quarterly Bonus", "LTA Component"],
  Freelance: ["UI/UX Design Payout", "Strategic Consulting", "Blog Content Writing", "Brand Identity Project"],
  Investment: ["Mutual Fund SIP", "FD Maturity Interest", "Equity Dividends", "Rental Credit"],
  Healthcare: ["Apollo Pharmacy", "Practo Consultation", "Dental Clinic", "Thyrocare Tests"],
  Education: ["Udemy Certification", "Textbook Bundle", "Data Science Workshop", "Coursera Specialization"],
};

function randomBetween(min: number, max: number) {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

export function generateMockTransactions(): Transaction[] {
  const transactions: Transaction[] = [];
  const now = new Date();

  for (let monthOffset = 5; monthOffset >= 0; monthOffset--) {
    // 2 income transactions per month
    for (let i = 0; i < 2; i++) {
      const incomeCategories = categories.filter((c) => c.type === "income");
      const pick = incomeCategories[Math.floor(Math.random() * incomeCategories.length)];
      const descs = descriptions[pick.category];
      const day = Math.floor(Math.random() * 28) + 1;
      const date = new Date(now.getFullYear(), now.getMonth() - monthOffset, day);
      transactions.push({
        id: generateId(),
        date: date.toISOString().split("T")[0],
        description: descs[Math.floor(Math.random() * descs.length)],
        amount: pick.category === "Salary" ? randomBetween(85000, 150000) : randomBetween(15000, 45000),
        type: "income",
        category: pick.category,
      });
    }

    // 10-15 expense transactions per month for a more realistic dashboard
    const expenseCount = Math.floor(Math.random() * 5) + 10;
    for (let i = 0; i < expenseCount; i++) {
      const expenseCategories = categories.filter((c) => c.type === "expense");
      const pick = expenseCategories[Math.floor(Math.random() * expenseCategories.length)];
      const descs = descriptions[pick.category];
      const day = Math.floor(Math.random() * 28) + 1;
      const date = new Date(now.getFullYear(), now.getMonth() - monthOffset, day);
      transactions.push({
        id: generateId(),
        date: date.toISOString().split("T")[0],
        description: descs[Math.floor(Math.random() * descs.length)],
        amount: randomBetween(250, 8000),
        type: "expense",
        category: pick.category,
      });
    }
  }

  return transactions.sort((a, b) => b.date.localeCompare(a.date));
}

