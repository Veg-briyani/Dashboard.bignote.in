import { useEffect, useState } from "react";
import { TablesPage } from "./TablesPage";
import { WelcomeCard } from "../components/dashboard/WelcomeCard";
import { ProfitCard } from "../components/dashboard/ProfitCard";
import { SalesCard } from "../components/dashboard/SalesCard";
import { RevenueChart } from "../components/dashboard/RevenueChart";
import { IncomeExpenses } from "../components/dashboard/IncomeExpenses";
import { TransactionsCard } from "../components/dashboard/TransactionsCard";
import { PaymentCard } from "../components/dashboard/PaymentCard";
import { TransactionStatsCard } from "../components/dashboard/TransactionStatsCard";
import { ProfileReport } from "../components/dashboard/ProfileReport";
import { AuthorStatistics } from "../components/dashboard/AuthorStatistics";
import { dashboardAPI } from "../services/dashboardAPI";

export const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await dashboardAPI.getSummary();
        setDashboardData(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="p-4">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="p-4 text-danger">{error}</div>;
  }

  return (
    <>
      <div className="row">
        <WelcomeCard userData={dashboardData?.overallStats} />

        <div className="col-lg-4 col-md-4 order-1">
          <div className="row">
            <ProfitCard data={dashboardData?.monthlyPerformance} />
            <SalesCard data={dashboardData?.monthlyPerformance} />
          </div>
        </div>

        <RevenueChart data={dashboardData?.yearlyTrend} />

        <div className="col-12 col-md-8 col-lg-4 order-3 order-md-2">
          <div className="row">
            <PaymentCard data={dashboardData?.recentTransactions} />
            <TransactionStatsCard data={dashboardData?.monthlyPerformance} />
            <ProfileReport data={dashboardData?.overallStats} />
          </div>
        </div>
      </div>
      <div className="row">
        <AuthorStatistics data={dashboardData?.topBooks} />
        <IncomeExpenses data={dashboardData?.monthlyPerformance} />
        <TransactionsCard data={dashboardData?.recentTransactions} />
      </div>
      <TablesPage data={dashboardData?.topBooks} />
    </>
  );
};

export default DashboardPage;
