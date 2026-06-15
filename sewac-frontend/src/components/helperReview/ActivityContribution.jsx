import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Collection Logging",
    value: 58,
    color: "#ff4da6",
  },
  {
    name: "Issue Reporting",
    value: 17,
    color: "#8b5cf6",
  },
  {
    name: "RFID Verification",
    value: 12,
    color: "#f59e0b",
  },
  {
    name: "Citizen Verification",
    value: 8,
    color: "#3b82f6",
  },
  {
    name: "Profile Updates",
    value: 5,
    color: "#10b981",
  },
];

const ActivityContribution = () => {
  return (
    <div className="dashboard-card chart-card">

      <h3 style={{ marginBottom: "20px" }}>
        Activity Contribution
      </h3>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: "260px",
        }}
      >

        <div
          style={{
            width: "45%",
            position: "relative",
          }}
        >
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                innerRadius={45}
                outerRadius={70}
                stroke="none"
              >
                {data.map((item) => (
                  <Cell
                    key={item.name}
                    fill={item.color}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: "24px",
              }}
            >
              100%
            </h2>

            <span
              style={{
                color: "#6b7280",
                fontSize: "12px",
              }}
            >
              Activity
            </span>
          </div>
        </div>

        <div
          style={{
            width: "55%",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {data.map((item) => (
            <div
              key={item.name}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: item.color,
                  }}
                />

                <span>{item.name}</span>
              </div>

              <strong>{item.value}%</strong>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};

export default ActivityContribution;