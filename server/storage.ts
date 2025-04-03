import { users, User, InsertUser, plans, Plan, InsertPlan, investments, Investment, InsertInvestment, transactions, Transaction, InsertTransaction, deposits, Deposit, InsertDeposit, withdrawals, Withdrawal, InsertWithdrawal, referrals, Referral, InsertReferral, loyaltyBonuses, LoyaltyBonus, InsertLoyaltyBonus } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // Session storage
  sessionStore: session.SessionStore;

  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser & { referralCode: string }): Promise<User>;
  updateUserBalance(id: number, newBalance: number): Promise<User | undefined>;
  updateUserLastLogin(id: number): Promise<User | undefined>;

  // Plan methods
  getAllPlans(): Promise<Plan[]>;
  getPlan(id: number): Promise<Plan | undefined>;
  createPlan(plan: InsertPlan): Promise<Plan>;

  // Investment methods
  getInvestmentsByUserId(userId: number): Promise<(Investment & { plan: Plan })[]>;
  getActiveInvestmentsByUserId(userId: number): Promise<(Investment & { plan: Plan })[]>;
  getAllActiveInvestments(): Promise<Investment[]>;
  createInvestment(investment: InsertInvestment): Promise<Investment>;
  updateInvestmentLastYieldDate(id: number): Promise<Investment | undefined>;

  // Transaction methods
  getTransactionsByUserId(userId: number, limit?: number): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getTotalYieldByUserId(userId: number): Promise<number>;

  // Deposit methods
  getDepositsByUserId(userId: number): Promise<Deposit[]>;
  createDeposit(deposit: InsertDeposit): Promise<Deposit>;
  approveDeposit(id: number): Promise<Deposit | undefined>;

  // Withdrawal methods
  getWithdrawalsByUserId(userId: number): Promise<Withdrawal[]>;
  getLastWithdrawalByUserId(userId: number): Promise<Withdrawal | undefined>;
  createWithdrawal(withdrawal: InsertWithdrawal): Promise<Withdrawal>;
  approveWithdrawal(id: number): Promise<Withdrawal | undefined>;

  // Referral methods
  getReferralsByReferrerId(referrerId: number): Promise<(Referral & { referred: User })[]>;
  createReferral(referral: InsertReferral): Promise<Referral>;
  updateReferralCommission(referrerId: number, referredId: number, amount: number): Promise<Referral | undefined>;
  getTotalCommissionsByUserId(userId: number): Promise<number>;

  // Loyalty Bonus methods
  createLoyaltyBonus(bonus: InsertLoyaltyBonus): Promise<LoyaltyBonus>;
  getAdminNotifications(): Promise<any[]>;
}

export class MemStorage implements IStorage {
  sessionStore: session.SessionStore;
  private users: Map<number, User>;
  private plans: Map<number, Plan>;
  private investments: Map<number, Investment>;
  private transactions: Map<number, Transaction>;
  private deposits: Map<number, Deposit>;
  private withdrawals: Map<number, Withdrawal>;
  private referrals: Map<number, Referral>;
  private loyaltyBonuses: Map<number, LoyaltyBonus>;

  private userIdCounter: number;
  private planIdCounter: number;
  private investmentIdCounter: number;
  private transactionIdCounter: number;
  private depositIdCounter: number;
  private withdrawalIdCounter: number;
  private referralIdCounter: number;
  private loyaltyBonusIdCounter: number;

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // 24 hours
    });

    this.users = new Map();
    this.plans = new Map();
    this.investments = new Map();
    this.transactions = new Map();
    this.deposits = new Map();
    this.withdrawals = new Map();
    this.referrals = new Map();
    this.loyaltyBonuses = new Map();

    this.userIdCounter = 1;
    this.planIdCounter = 1;
    this.investmentIdCounter = 1;
    this.transactionIdCounter = 1;
    this.depositIdCounter = 1;
    this.withdrawalIdCounter = 1;
    this.referralIdCounter = 1;
    this.loyaltyBonusIdCounter = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(user: InsertUser & { referralCode: string }): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();

    // Define o primeiro usuário como admin, todos os outros como user
    const isFirstUser = this.users.size === 0;
    const role = isFirstUser ? "admin" : "user";

    const newUser: User = {
      id,
      ...user,
      role, // Adicionando o role (admin para o primeiro usuário)
      balance: 0,
      createdAt: now,
      lastLogin: now,
    };
    this.users.set(id, newUser);
    return newUser;
  }

  async updateUserBalance(id: number, newBalance: number): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;

    const updatedUser = { ...user, balance: newBalance };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async updateUserLastLogin(id: number): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;

    const updatedUser = { ...user, lastLogin: new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Plan methods
  async getAllPlans(): Promise<Plan[]> {
    return Array.from(this.plans.values());
  }

  async getPlan(id: number): Promise<Plan | undefined> {
    return this.plans.get(id);
  }

  async createPlan(plan: InsertPlan): Promise<Plan> {
    const id = this.planIdCounter++;
    const newPlan: Plan = { id, ...plan };
    this.plans.set(id, newPlan);
    return newPlan;
  }

  // Investment methods
  async getInvestmentsByUserId(userId: number): Promise<(Investment & { plan: Plan })[]> {
    const userInvestments = Array.from(this.investments.values()).filter(
      (investment) => investment.userId === userId
    );

    return Promise.all(
      userInvestments.map(async (investment) => {
        const plan = await this.getPlan(investment.planId);
        return { ...investment, plan: plan! };
      })
    );
  }

  async getActiveInvestmentsByUserId(userId: number): Promise<(Investment & { plan: Plan })[]> {
    const userInvestments = Array.from(this.investments.values()).filter(
      (investment) => investment.userId === userId && investment.isActive
    );

    return Promise.all(
      userInvestments.map(async (investment) => {
        const plan = await this.getPlan(investment.planId);
        return { ...investment, plan: plan! };
      })
    );
  }

  async getAllActiveInvestments(): Promise<Investment[]> {
    return Array.from(this.investments.values()).filter(
      (investment) => investment.isActive
    );
  }

  async createInvestment(investment: InsertInvestment): Promise<Investment> {
    const id = this.investmentIdCounter++;
    const now = new Date();
    const newInvestment: Investment = {
      id,
      ...investment,
      startDate: now,
      lastYieldDate: now,
      isActive: true,
      endDate: null,
    };
    this.investments.set(id, newInvestment);
    return newInvestment;
  }

  async updateInvestmentLastYieldDate(id: number): Promise<Investment | undefined> {
    const investment = this.investments.get(id);
    if (!investment) return undefined;

    const updatedInvestment = { ...investment, lastYieldDate: new Date() };
    this.investments.set(id, updatedInvestment);
    return updatedInvestment;
  }

  // Transaction methods
  async getTransactionsByUserId(userId: number, limit?: number): Promise<Transaction[]> {
    let transactions = Array.from(this.transactions.values())
      .filter((transaction) => transaction.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    if (limit) {
      transactions = transactions.slice(0, limit);
    }

    return transactions;
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const id = this.transactionIdCounter++;
    const newTransaction: Transaction = {
      id,
      ...transaction,
      createdAt: new Date(),
    };
    this.transactions.set(id, newTransaction);
    return newTransaction;
  }

  async getTotalYieldByUserId(userId: number): Promise<number> {
    const yieldTransactions = Array.from(this.transactions.values()).filter(
      (transaction) => transaction.userId === userId && transaction.type === "yield"
    );

    return yieldTransactions.reduce((total, transaction) => total + transaction.amount, 0);
  }

  // Deposit methods
  async getDepositsByUserId(userId: number): Promise<Deposit[]> {
    return Array.from(this.deposits.values())
      .filter((deposit) => deposit.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createDeposit(deposit: InsertDeposit): Promise<Deposit> {
    const id = this.depositIdCounter++;
    const now = new Date();
    const newDeposit: Deposit = {
      id,
      ...deposit,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    };
    this.deposits.set(id, newDeposit);
    return newDeposit;
  }

  async approveDeposit(id: number): Promise<Deposit | undefined> {
    const deposit = this.deposits.get(id);
    if (!deposit || deposit.status !== "pending") return undefined;

    const now = new Date();
    const updatedDeposit = { ...deposit, status: "approved", updatedAt: now };
    this.deposits.set(id, updatedDeposit);

    // Add to user balance
    const user = await this.getUser(deposit.userId);
    if (user) {
      await this.updateUserBalance(user.id, user.balance + deposit.amount);

      // Record transaction
      await this.createTransaction({
        userId: user.id,
        type: "deposit",
        amount: deposit.amount,
        description: `Deposit via ${deposit.method}`
      });
    }

    return updatedDeposit;
  }

  // Withdrawal methods
  async getWithdrawalsByUserId(userId: number): Promise<Withdrawal[]> {
    return Array.from(this.withdrawals.values())
      .filter((withdrawal) => withdrawal.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getLastWithdrawalByUserId(userId: number): Promise<Withdrawal | undefined> {
    const userWithdrawals = Array.from(this.withdrawals.values())
      .filter((withdrawal) => withdrawal.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return userWithdrawals[0];
  }

  async createWithdrawal(withdrawal: InsertWithdrawal): Promise<Withdrawal> {
    const id = this.withdrawalIdCounter++;
    const newWithdrawal: Withdrawal = {
      id,
      ...withdrawal,
      status: "pending",
      createdAt: new Date(),
      processedAt: null,
    };
    this.withdrawals.set(id, newWithdrawal);
    return newWithdrawal;
  }

  async approveWithdrawal(id: number): Promise<Withdrawal | undefined> {
    const withdrawal = this.withdrawals.get(id);
    if (!withdrawal || withdrawal.status !== "pending") return undefined;

    const now = new Date();
    const updatedWithdrawal = {
      ...withdrawal,
      status: "approved",
      processedAt: now,
    };
    this.withdrawals.set(id, updatedWithdrawal);

    // Record transaction
    await this.createTransaction({
      userId: withdrawal.userId,
      type: "withdrawal_processed",
      amount: 0, // Balance already deducted when creating withdrawal request
      description: `Withdrawal processed via ${withdrawal.method}`
    });

    return updatedWithdrawal;
  }

  // Referral methods
  async getReferralsByReferrerId(referrerId: number): Promise<(Referral & { referred: User })[]> {
    const referrerReferrals = Array.from(this.referrals.values()).filter(
      (referral) => referral.referrerId === referrerId
    );

    return Promise.all(
      referrerReferrals.map(async (referral) => {
        const referred = await this.getUser(referral.referredId);
        return { ...referral, referred: referred! };
      })
    );
  }

  async createReferral(referral: InsertReferral): Promise<Referral> {
    const id = this.referralIdCounter++;
    const newReferral: Referral = {
      id,
      ...referral,
      commission: 0,
      isActive: true,
      createdAt: new Date(),
    };
    this.referrals.set(id, newReferral);
    return newReferral;
  }

  async updateReferralCommission(referrerId: number, referredId: number, amount: number): Promise<Referral | undefined> {
    const referral = Array.from(this.referrals.values()).find(
      (ref) => ref.referrerId === referrerId && ref.referredId === referredId
    );

    if (!referral) return undefined;

    const updatedReferral = {
      ...referral,
      commission: referral.commission + amount,
    };
    this.referrals.set(referral.id, updatedReferral);
    return updatedReferral;
  }

  async getTotalCommissionsByUserId(userId: number): Promise<number> {
    const userReferrals = Array.from(this.referrals.values()).filter(
      (referral) => referral.referrerId === userId
    );

    return userReferrals.reduce((total, referral) => total + referral.commission, 0);
  }

  // Loyalty Bonus methods
  async createLoyaltyBonus(bonus: InsertLoyaltyBonus): Promise<LoyaltyBonus> {
    const id = this.loyaltyBonusIdCounter++;
    const newBonus: LoyaltyBonus = {
      id,
      ...bonus,
      createdAt: new Date(),
    };
    this.loyaltyBonuses.set(id, newBonus);
    return newBonus;
  }

  async getAdminNotifications(): Promise<any[]> {
    const notifications = [];

    // Get recent transactions
    const recentTransactions = Array.from(this.transactions.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0,10);

    // Get recent user registrations
    const recentUsers = Array.from(this.users.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0,10);


    // Create notifications for transactions
    for (const transaction of recentTransactions) {
      const user = await this.getUser(transaction.userId);
      notifications.push({
        id: `tx-${transaction.id}`,
        title: `Nova ${transaction.type === 'deposit' ? 'Depósito' : 
                transaction.type === 'withdrawal' ? 'Saque' : 
                transaction.type === 'investment' ? 'Investimento' : 'Transação'}`,
        message: `${user ? user.username : 'Usuário Desconhecido'} realizou ${transaction.type === 'deposit' ? 'um depósito de' : 
                  transaction.type === 'withdrawal' ? 'um saque de' : 
                  transaction.type === 'investment' ? 'um investimento de' : 'uma transação de'} ${transaction.amount}`,
        type: transaction.type === 'deposit' ? 'success' : 
              transaction.type === 'withdrawal' ? 'warning' : 'info',
        createdAt: transaction.createdAt,
        read: false
      });
    }

    // Create notifications for new users
    for (const user of recentUsers) {
      notifications.push({
        id: `user-${user.id}`,
        title: "Novo Usuário",
        message: `${user.username} se registrou na plataforma`,
        type: "info",
        createdAt: user.createdAt,
        read: false
      });
    }

    // Sort by date
    return notifications.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
}

export const storage = new MemStorage();