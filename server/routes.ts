import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { insertPlanSchema, insertInvestmentSchema, insertDepositSchema, insertWithdrawalSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Initialize the database with default investment plans
  await initializePlans();

  // Investment Plans API
  app.get("/api/plans", async (req, res) => {
    try {
      const plans = await storage.getAllPlans();
      res.json(plans);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch investment plans" });
    }
  });

  // User Dashboard Data API
  app.get("/api/dashboard", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const userId = req.user!.id;
      const user = await storage.getUser(userId);
      const activeInvestments = await storage.getActiveInvestmentsByUserId(userId);
      const transactions = await storage.getTransactionsByUserId(userId, 5);
      const referrals = await storage.getReferralsByReferrerId(userId);
      const totalYield = await storage.getTotalYieldByUserId(userId);
      const totalCommissions = await storage.getTotalCommissionsByUserId(userId);

      res.json({
        balance: user!.balance,
        activeInvestments,
        transactions,
        referrals,
        totalYield,
        totalCommissions
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  // Investments API
  app.get("/api/investments", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const investments = await storage.getInvestmentsByUserId(req.user!.id);
      res.json(investments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch investments" });
    }
  });

  app.post("/api/investments", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const userId = req.user!.id;
      const validatedData = insertInvestmentSchema.parse({ ...req.body, userId });

      // Check if user has enough balance
      const user = await storage.getUser(userId);
      if (!user || user.balance < validatedData.amount) {
        return res.status(400).json({ message: "Insufficient balance" });
      }

      // Get the plan to verify minimum investment
      const plan = await storage.getPlan(validatedData.planId);
      if (!plan || !plan.isActive) {
        return res.status(400).json({ message: "Invalid investment plan" });
      }

      if (validatedData.amount < plan.minimumInvestment) {
        return res.status(400).json({ 
          message: `Minimum investment for this plan is ${plan.minimumInvestment}` 
        });
      }

      // Create investment and deduct from balance
      await storage.updateUserBalance(userId, user.balance - validatedData.amount);
      const investment = await storage.createInvestment(validatedData);

      // Record transaction
      await storage.createTransaction({
        userId,
        type: "investment",
        amount: -validatedData.amount,
        description: `Investment in ${plan.name} plan`
      });

      // If user was referred, give commission to referrer (5% of investment)
      if (user.referredBy) {
        const commission = validatedData.amount * 0.05;
        await storage.updateReferralCommission(user.referredBy, userId, commission);
        await storage.updateUserBalance(user.referredBy, (await storage.getUser(user.referredBy))!.balance + commission);

        // Record commission transaction
        await storage.createTransaction({
          userId: user.referredBy,
          type: "commission",
          amount: commission,
          description: `Referral commission from ${user.username}`
        });
      }

      res.status(201).json(investment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to create investment" });
    }
  });

  // Deposits API
  app.get("/api/deposits", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const deposits = await storage.getDepositsByUserId(req.user!.id);
      res.json(deposits);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch deposits" });
    }
  });

  app.post("/api/deposits", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const userId = req.user!.id;
      const validatedData = insertDepositSchema.parse({ ...req.body, userId });

      const deposit = await storage.createDeposit(validatedData);
      res.status(201).json(deposit);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to create deposit request" });
    }
  });

  // Withdrawals API
  app.get("/api/withdrawals", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const withdrawals = await storage.getWithdrawalsByUserId(req.user!.id);
      res.json(withdrawals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch withdrawals" });
    }
  });

  app.post("/api/withdrawals", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const userId = req.user!.id;
      const validatedData = insertWithdrawalSchema.parse({ ...req.body, userId });

      // Check if user has enough balance
      const user = await storage.getUser(userId);
      if (!user || user.balance < validatedData.amount) {
        return res.status(400).json({ message: "Insufficient balance" });
      }

      // Check last withdrawal date (no withdrawal in the last 2 days)
      const lastWithdrawal = await storage.getLastWithdrawalByUserId(userId);
      if (lastWithdrawal) {
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

        if (new Date(lastWithdrawal.createdAt) > twoDaysAgo) {
          return res.status(400).json({ 
            message: "You can only request a withdrawal every 2 days" 
          });
        }
      }

      // Create withdrawal request
      const withdrawal = await storage.createWithdrawal(validatedData);

      // Update user balance
      await storage.updateUserBalance(userId, user.balance - validatedData.amount);

      // Record transaction
      await storage.createTransaction({
        userId,
        type: "withdrawal_request",
        amount: -validatedData.amount,
        description: `Withdrawal request via ${validatedData.method}`
      });

      res.status(201).json(withdrawal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to create withdrawal request" });
    }
  });

  // Referrals API
  app.get("/api/referrals", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const referrals = await storage.getReferralsByReferrerId(req.user!.id);
      res.json(referrals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch referrals" });
    }
  });

  // Transactions API
  app.get("/api/transactions", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const transactions = await storage.getTransactionsByUserId(req.user!.id);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  // Admin Transactions API
  app.get("/api/admin/transactions", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.role !== "admin") {
      return res.sendStatus(401);
    }

    try {
      const allTransactions = Array.from(storage.transactions.values())
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      const transactionsWithUsernames = await Promise.all(
        allTransactions.map(async (transaction) => {
          const user = await storage.getUser(transaction.userId);
          return {
            ...transaction,
            username: user ? user.username : 'Unknown User'
          };
        })
      );

      res.json(transactionsWithUsernames);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  // Admin Notifications API
  app.get("/api/admin/notifications", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const notifications = await storage.getAdminNotifications();
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });


  // Simulate daily yield calculation (would be a cron job in a real app)
  app.post("/api/admin/calculate-yields", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      await calculateDailyYields();
      res.json({ message: "Yields calculated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to calculate yields" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Initialize default investment plans
async function initializePlans() {
  const existingPlans = await storage.getAllPlans();
  if (existingPlans.length === 0) {
    // Default plans according to requirements
    const plans = [
      {
        name: "Básico",
        description: "Ideal para iniciantes",
        minimumInvestment: 50,
        dailyInterestRate: 0.1, // 10%
        features: ["Suporte por email", "Material educativo", "Saques a cada 2 dias"],
        icon: "ri-seedling-fill"
      },
      {
        name: "Intermediário",
        description: "Comece a crescer",
        minimumInvestment: 100,
        dailyInterestRate: 0.12, // 12%
        features: ["Suporte padrão", "Reinvestimento automático", "Acesso a tutoriais"],
        icon: "ri-bar-chart-fill"
      },
      {
        name: "Avançado",
        description: "Equilíbrio perfeito",
        minimumInvestment: 500,
        dailyInterestRate: 0.15, // 15%
        features: ["Suporte dedicado", "Bônus de fidelidade 5%", "Acesso a relatórios"],
        icon: "ri-award-fill"
      },
      {
        name: "Premium",
        description: "Alto rendimento diário",
        minimumInvestment: 1000,
        dailyInterestRate: 0.18, // 18%
        features: ["Suporte premium", "Bônus de fidelidade 7%", "Saques rápidos"],
        icon: "ri-vip-diamond-fill"
      },
      {
        name: "Master",
        description: "Nosso plano mais exclusivo",
        minimumInvestment: 5000,
        dailyInterestRate: 0.25, // 25%
        features: ["Suporte prioritário", "Bônus de fidelidade 10%", "Saques prioritários"],
        icon: "ri-vip-crown-fill"
      }
    ];

    for (const plan of plans) {
      await storage.createPlan(plan);
    }
  }
}

// Calculate daily yields for all active investments
async function calculateDailyYields() {
  const activeInvestments = await storage.getAllActiveInvestments();

  for (const investment of activeInvestments) {
    // Check if yield already calculated today
    const lastYieldDate = new Date(investment.lastYieldDate);
    const today = new Date();

    if (
      lastYieldDate.getDate() === today.getDate() &&
      lastYieldDate.getMonth() === today.getMonth() &&
      lastYieldDate.getFullYear() === today.getFullYear()
    ) {
      continue;
    }

    // Get plan details
    const plan = await storage.getPlan(investment.planId);
    if (!plan) continue;

    // Calculate yield
    const yield_ = investment.amount * plan.dailyInterestRate;

    // Update investment last yield date
    await storage.updateInvestmentLastYieldDate(investment.id);

    // Update user balance
    const user = await storage.getUser(investment.userId);
    if (!user) continue;

    await storage.updateUserBalance(user.id, user.balance + yield_);

    // Record transaction
    await storage.createTransaction({
      userId: user.id,
      type: "yield",
      amount: yield_,
      description: `Daily yield from ${plan.name} plan`
    });

    // Check for 30-day loyalty bonus
    const startDate = new Date(investment.startDate);
    const daysActive = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysActive === 30) {
      // Calculate 5% bonus
      const bonus = investment.amount * 0.05;

      // Update user balance
      await storage.updateUserBalance(user.id, user.balance + bonus);

      // Record loyalty bonus
      await storage.createLoyaltyBonus({
        userId: user.id,
        investmentId: investment.id,
        amount: bonus
      });

      // Record transaction
      await storage.createTransaction({
        userId: user.id,
        type: "bonus",
        amount: bonus,
        description: `30-day loyalty bonus from ${plan.name} plan`
      });
    }
  }
}