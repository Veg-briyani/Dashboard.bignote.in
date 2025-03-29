import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export const RevenueChart = () => {
  const [chartData, setChartData] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [yearlyPerformance, setYearlyPerformance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const { yearlyPerformance } = response.data;
        setYearlyPerformance(yearlyPerformance);

        if (yearlyPerformance.length > 0) {
          setSelectedYear(yearlyPerformance[0].year.toString());
          setChartData(yearlyPerformance[0].monthlyRevenue);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleYearChange = (year) => {
    setSelectedYear(year);
    const selectedYearData = yearlyPerformance.find((item) => item.year.toString() === year);
    if (selectedYearData) {
      setChartData(selectedYearData.monthlyRevenue);
    }
  };

  // Calculate current month, previous month, and growth stats
  const statistics = useMemo(() => {
    if (!chartData || chartData.length === 0) {
      return {
        growth: 0,
        currentMonth: { name: "N/A", revenue: 0, number: 0 },
        previousMonth: { name: "N/A", revenue: 0, number: 0 },
        progressPercentage: 0
      };
    }

    // Sort data by month number
    const sortedData = [...chartData].sort((a, b) => b.month - a.month);
    
    // Find months with data (non-zero revenue)
    const monthsWithData = sortedData.filter(m => m.revenue > 0);
    
    // Current and previous months
    const currentMonth = monthsWithData.length > 0 ? monthsWithData[0] : { month: 0, revenue: 0 };
    const previousMonth = monthsWithData.length > 1 ? monthsWithData[1] : { month: 0, revenue: 0 };
    
    // Calculate growth percentage
    const growth = previousMonth.revenue 
      ? ((currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue) * 100 
      : 0;
    
    // Get month names
    const getMonthName = (monthNumber) => {
      return new Date(0, monthNumber - 1).toLocaleString('default', { month: 'long' });
    };
    
    // Calculate progress percentage (assuming a yearly target of 3x the highest monthly revenue)
    const highestRevenue = Math.max(...chartData.map(item => item.revenue));
    const yearlyTarget = highestRevenue * 3;
    const totalYearRevenue = chartData.reduce((sum, item) => sum + item.revenue, 0);
    const progressPercentage = yearlyTarget > 0 ? (totalYearRevenue / yearlyTarget) * 100 : 0;
    
    return {
      growth: growth.toFixed(1),
      currentMonth: {
        name: getMonthName(currentMonth.month),
        revenue: currentMonth.revenue,
        number: currentMonth.month
      },
      previousMonth: {
        name: getMonthName(previousMonth.month),
        revenue: previousMonth.revenue,
        number: previousMonth.month
      },
      progressPercentage: progressPercentage.toFixed(0)
    };
  }, [chartData]);
  
  return (
    <div className="col-12 col-lg-8 order-2 order-md-3 order-lg-2 mb-4">
      <div className="card">
        <div className="row row-bordered g-0">
          <div className="col-md-8">
            <div className="card-header d-flex align-items-center justify-content-between">
              <h5 className="m-0">Total Revenue</h5>
              <div className="dropdown">
                <button
                  className="btn btn-sm btn-outline-primary dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {selectedYear}
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  {yearlyPerformance.map((item) => (
                    <li key={item.year}>
                      <a
                        className="dropdown-item"
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleYearChange(item.year.toString());
                        }}
                      >
                        {item.year}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="px-2" style={{ height: "300px" }}>
              {loading ? (
                <div className="d-flex justify-content-center align-items-center h-100">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis
                      dataKey="month"
                      stroke="#697a8d"
                      fontSize={13}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => new Date(0, value - 1).toLocaleString('default', { month: 'short' })}
                    />
                    <YAxis
                      stroke="#697a8d"
                      fontSize={13}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `₹${value}`}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#fff",
                        border: "1px solid #ddd",
                      }}
                      formatter={(value) => [`₹${value}`, "Revenue"]}
                      labelFormatter={(label) => new Date(0, label - 1).toLocaleString('default', { month: 'long' })}
                    />
                    <Bar
                      dataKey="revenue"
                      fill="#696cff"
                      radius={[4, 4, 0, 0]}
                      barSize={45}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
          <div className="col-md-4">
            <div className="card-body">
              {/* Growth Stats with Animation */}
              <div className="text-center py-4 animate__animated animate__fadeIn">
                <div className="d-flex flex-column align-items-center">
                  <h3 className="display-6 mb-1 text-gradient text-primary">
                    {statistics.growth}%
                  </h3>
                  <div className="d-flex align-items-center gap-1">
                    <i className={`bx ${parseFloat(statistics.growth) >= 0 ? 'bx-trending-up text-success' : 'bx-trending-down text-danger'} fs-5`}></i>
                    <span className={`${parseFloat(statistics.growth) >= 0 ? 'text-success' : 'text-danger'} fw-semibold small`}>
                      Monthly Growth
                    </span>
                  </div>
                </div>
              </div>

              {/* Month Comparison with Dynamic Data */}
              <div className="d-flex flex-column gap-4 mt-4 pt-3 border-top border-light">
                {[
                  {
                    month: statistics.currentMonth.name,
                    status: 'Current Month',
                    amount: statistics.currentMonth.revenue,
                    icon: 'bx-calendar',
                    color: 'primary'
                  },
                  {
                    month: statistics.previousMonth.name,
                    status: 'Previous Month',
                    amount: statistics.previousMonth.revenue,
                    icon: 'bx-history',
                    color: 'info'
                  }
                ].map((item, index) => (
                  <div key={index} className="d-flex align-items-center justify-content-between hover-effect">
                    <div className="d-flex align-items-center gap-3">
                      <div className={`avatar avatar-sm bg-label-${item.color}`}>
                        <span className={`avatar-initial rounded-circle bg-${item.color}`}>
                          <i className={`bx ${item.icon} text-white`}></i>
                        </span>
                      </div>
                      <div>
                        <h6 className="mb-0">{item.month}</h6>
                        <small className="text-muted">{item.status}</small>
                      </div>
                    </div>
                    <h5 className={`mb-0 text-${item.color}`}>
                      ₹{(item.amount / 1000).toFixed(1)}k
                    </h5>
                  </div>
                ))}
              </div>

              {/* Dynamic Progress Indicator */}
              <div className="mt-4">
                <div className="d-flex justify-content-between small text-muted mb-2">
                  <span>Progress</span>
                  <span>{statistics.progressPercentage}% of target</span>
                </div>
                <div className="progress" style={{ height: '4px' }}>
                  <div
                    className="progress-bar bg-success"
                    role="progressbar"
                    style={{ width: `${statistics.progressPercentage}%` }}
                    aria-valuenow={statistics.progressPercentage}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};