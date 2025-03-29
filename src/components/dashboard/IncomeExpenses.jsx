import { useState, useEffect } from "react";
import { dashboardAPI } from "../../services/dashboardAPI";

export const IncomeExpenses = () => {
  const [incomeData, setIncomeData] = useState({
    title: "Total Balance",
    amount: "₹0.00",
    change: "0% Increase",
    metric: "Revenue This Week",
    comparison: "₹0 compared to last week",
    icon: "/assets/img/icons/unicons/wallet.png",
    chartColor: "success",
    monthlyTarget: 0,
    monthlyProgress: 0,
  });

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const response = await dashboardAPI.getBookSales();
        const books = response.data.books;

        // Calculate total revenue from all books
        const totalRevenue = books.reduce((sum, book) => {
          return sum + book.price * book.soldCopies;
        }, 0);

        // Calculate monthly target (example: 20% more than current revenue)
        const monthlyTarget = totalRevenue * 1.2;

        // Calculate progress towards monthly target
        const progress = Math.min((totalRevenue / monthlyTarget) * 100, 100);

        // Calculate revenue change (example calculation)
        const lastMonthRevenue = books.reduce((sum, book) => {
          return sum + book.price * book.lastMonthSale;
        }, 0);

        const revenueChange =
          lastMonthRevenue > 0
            ? ((totalRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
            : 0;

        const comparison =
          totalRevenue > lastMonthRevenue
            ? `₹${(totalRevenue - lastMonthRevenue).toFixed(2)} more than last month`
            : `₹${(lastMonthRevenue - totalRevenue).toFixed(2)} less than last month`;

        setIncomeData({
          ...incomeData,
          amount: `₹${totalRevenue.toFixed(2)}`,
          change: `${Math.abs(revenueChange).toFixed(1)}% ${
            revenueChange >= 0 ? "Increase" : "Decrease"
          }`,
          comparison,
          monthlyTarget: monthlyTarget.toFixed(2),
          monthlyProgress: progress,
        });
      } catch (error) {
        console.error("Error fetching book data:", error);
      }
    };

    fetchBookData();
  }, []);

  return (
    <div className="col-md-6 col-lg-4 order-1 mb-4">
      <div className="card h-100">
        <div className="card-header pb-0">
          <h5 className="card-title mb-0">Income Overview</h5>
        </div>

        <div className="card-body px-0">
          <div className="tab-content">
            <div className="tab-pane fade show active" role="tabpanel">
              <div className="d-flex p-4 pt-3">
                <div className="avatar flex-shrink-0 me-3 bg-label-primary rounded-3 p-2">
                  <img
                    src={incomeData.icon}
                    alt="income"
                    className="w-100 h-100"
                    style={{ objectFit: "contain" }}
                  />
                </div>
                <div className="flex-grow-1">
                  <small className="text-muted d-block">
                    {incomeData.title}
                  </small>
                  <div className="d-flex align-items-center justify-content-between">
                    <h4 className="mb-0 me-1">{incomeData.amount}</h4>
                    <span className="badge bg-label-success rounded-pill">
                      <i className="bx bx-chevron-up me-1"></i>
                      {incomeData.change}
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-4">
                <div className="d-flex align-items-center justify-content-between border-top pt-4">
                  <div>
                    <p className="mb-1 fw-medium">{incomeData.metric}</p>
                    <small className="text-muted">
                      {incomeData.comparison}
                    </small>
                  </div>
                  <div className="progress w-50" style={{ height: "6px" }}>
                    <div
                      className="progress-bar bg-success"
                      role="progressbar"
                      style={{ width: "75%" }}
                    />
                  </div>
                </div>
              </div>

              <div className="px-4 mt-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-2">
                    <div className="avatar avatar-sm">
                      <div className="avatar-initial bg-label-info rounded">
                        <i className="bx bx-rupee"></i>
                      </div>
                    </div>
                    <div>
                      <p className="mb-0 fw-medium">Monthly Target</p>
                      <small className="text-muted">
                        {incomeData.monthlyProgress.toFixed(0)}% completed
                      </small>
                    </div>
                  </div>
                  <span className="badge bg-label-success rounded-pill">
                    +₹{(incomeData.monthlyTarget / 1000).toFixed(1)}k
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
