import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

import { activityTrendData } from "./mockData";

const OperationalTrendChart = () => {
  return (
    <div className="dashboard-card trend-card">

      <div className="card-header">

        <div>
          <h3>Operational Activity Trend</h3>

          <div
            style={{
              display: "flex",
              gap: "16px",
              marginTop: "8px",
              fontSize: "12px",
              color: "#6b7280",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#8b5cf6",
                  display: "inline-block",
                }}
              />
              Collections
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#ff4da6",
                  display: "inline-block",
                }}
              />
              Issues
            </div>
          </div>

        </div>

        <span>Last 30 Days</span>

      </div>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={activityTrendData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="day" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="collections"
            stroke="#8b5cf6"
            strokeWidth={3}
          />

          <Line
            type="monotone"
            dataKey="issues"
            stroke="#ff4da6"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>

    </div>
  );
};

export default OperationalTrendChart;