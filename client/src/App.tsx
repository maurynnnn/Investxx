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
import UsersManagement from "@/pages/admin/users-management";
import WithdrawalApprovals from "@/pages/admin/withdrawal-approvals";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      
      {/* Main Navigation Routes */}
      <ProtectedRoute path="/" component={DashboardPage} />
      <ProtectedRoute path="/investments" component={InvestmentsPage} />
      <ProtectedRoute path="/deposits" component={DepositsPage} />
      <ProtectedRoute path="/withdrawals" component={WithdrawalsPage} />
      <ProtectedRoute path="/referrals" component={ReferralsPage} />
      
      {/* User Menu Routes */}
      <ProtectedRoute path="/profile" component={ProfilePage} />
      <ProtectedRoute path="/settings" component={SettingsPage} />
      <ProtectedRoute path="/support" component={SupportPage} />
      <ProtectedRoute path="/transactions" component={TransactionsPage} />
      <ProtectedRoute path="/payment-methods" component={PaymentMethodsPage} />
      
      {/* Admin Routes */}
      <ProtectedRoute path="/admin" component={AdminDashboard} />
      <ProtectedRoute path="/admin/users" component={UsersManagement} />
      <ProtectedRoute path="/admin/withdrawals" component={WithdrawalApprovals} />
      
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
