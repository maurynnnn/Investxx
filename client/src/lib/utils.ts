import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);
}

export function formatDate(date: Date, options: Intl.DateTimeFormatOptions = {}): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'numeric', 
    year: 'numeric'
  };

  return new Intl.DateTimeFormat('pt-BR', { ...defaultOptions, ...options }).format(date);
}

export function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(0)}%`;
}

export function calculateDaysRemaining(startDate: Date, daysTotal: number): number {
  const now = new Date();
  const daysPassed = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, daysTotal - daysPassed);
}

export function calculateProgressPercentage(startDate: Date, daysTotal: number): number {
  const daysRemaining = calculateDaysRemaining(startDate, daysTotal);
  const progress = ((daysTotal - daysRemaining) / daysTotal) * 100;
  return Math.min(100, Math.max(0, progress));
}

export function getTransactionIcon(type: string): string {
  switch (type) {
    case 'deposit':
      return 'ri-arrow-down-line';
    case 'withdrawal':
    case 'withdrawal_request':
      return 'ri-arrow-up-line';
    case 'investment':
      return 'ri-funds-line';
    case 'yield':
      return 'ri-arrow-down-line';
    case 'commission':
      return 'ri-user-add-line';
    case 'bonus':
      return 'ri-award-line';
    default:
      return 'ri-exchange-line';
  }
}

export function getTransactionColor(type: string): string {
  switch (type) {
    case 'deposit':
    case 'yield':
    case 'commission':
    case 'bonus':
      return 'positive';
    case 'withdrawal':
    case 'withdrawal_request':
    case 'investment':
      return 'negative';
    default:
      return 'primary';
  }
}
