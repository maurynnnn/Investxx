import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import DashboardPage from "@/pages/dashboard-page";
import InvestmentsPage from "@/pages/investments-page";
import DepositsPage from "@/pages/deposits-page";
import WithdrawalsPage from "@/pages/withdrawals-page";
import ReferralsPage from "@/pages/referrals-page";
import ProfilePage from "@/pages/profile-page";
import SettingsPage from "@/pages/settings-page";
import SupportPage from "@/pages/support-page";
import TransactionsPage from "@/pages/transactions-page";
import PaymentMethodsPage from "@/pages/payment-methods-page";

// Admin pages
import AdminDashboard from "@/pages/admin/admin-dashboard";
import AdminUsersPage from "@/pages/admin/admin-users-page";
import AdminPlansPage from "@/pages/admin/admin-plans-page";
import WithdrawalApprovals from "@/pages/admin/withdrawal-approvals";
import AdminStatistics from "@/pages/admin/admin-statistics";
import AdminTransactions from "@/pages/admin/admin-transactions";
import AdminSettings from "@/pages/admin/admin-settings";
import AdminNotifications from "@/pages/admin/admin-notifications";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      
      {/* Main Navigation Routes - Somente para usuários comuns */}
      <ProtectedRoute path="/" component={DashboardPage} userOnly={true} />
      <ProtectedRoute path="/investments" component={InvestmentsPage} userOnly={true} />
      <ProtectedRoute path="/deposits" component={DepositsPage} userOnly={true} />
      <ProtectedRoute path="/withdrawals" component={WithdrawalsPage} userOnly={true} />
      <ProtectedRoute path="/referrals" component={ReferralsPage} userOnly={true} />
      
      {/* User Menu Routes - Somente para usuários comuns */}
      <ProtectedRoute path="/profile" component={ProfilePage} userOnly={true} />
      <ProtectedRoute path="/settings" component={SettingsPage} userOnly={true} />
      <ProtectedRoute path="/support" component={SupportPage} userOnly={true} />
      <ProtectedRoute path="/transactions" component={TransactionsPage} userOnly={true} />
      <ProtectedRoute path="/payment-methods" component={PaymentMethodsPage} userOnly={true} />
      
      {/* Admin Routes */}
      <ProtectedRoute path="/admin" component={AdminDashboard} adminOnly={true} />
      <ProtectedRoute path="/admin/users" component={AdminUsersPage} adminOnly={true} />
      <ProtectedRoute path="/admin/plans" component={AdminPlansPage} adminOnly={true} />
      <ProtectedRoute path="/admin/withdrawals" component={WithdrawalApprovals} adminOnly={true} />
      <ProtectedRoute path="/admin/statistics" component={AdminStatistics} adminOnly={true} />
      <ProtectedRoute path="/admin/transactions" component={AdminTransactions} adminOnly={true} />
      <ProtectedRoute path="/admin/settings" component={AdminSettings} adminOnly={true} />
      <ProtectedRoute path="/admin/notifications" component={AdminNotifications} adminOnly={true} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
