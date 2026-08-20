import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { useLanguage } from "../../i18n";

/*
|--------------------------------------------------------------------------
| GVP GENERATION TREND
|--------------------------------------------------------------------------
|
| Shows GVP for ALL wards under the selected:
|
| City
|   ↓
| Zone
|   ↓
| Division
|   ↓
| Date
|
| IMPORTANT:
|
| selectedWard is intentionally NOT used here.
|
| The graph always shows every ward belonging to the
| selected division for the selected date.
|--------------------------------------------------------------------------
*/

export default function GVPGen({
  selectedDate,
  selectedCity,
  selectedZone,
  selectedDivision,
}) {
  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const { t } = useLanguage();

  /*
  |--------------------------------------------------------------------------
  | LOAD GVP DATA
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let cancelled = false;

    const loadGVP = async () => {
      try {
        /*
        |--------------------------------------------------------------------------
        | CITY IS REQUIRED
        |--------------------------------------------------------------------------
        */

        if (!selectedCity?.city_id) {
          if (!cancelled) {
            setData([]);
            setError("");
          }

          return;
        }

        /*
        |--------------------------------------------------------------------------
        | BUILD QUERY
        |--------------------------------------------------------------------------
        |
        | IMPORTANT:
        |
        | selectedWard is NOT sent.
        |
        | Therefore the backend returns ALL wards under
        | the selected division.
        |--------------------------------------------------------------------------
        */

        const params = new URLSearchParams();

        if (selectedDate) {
          params.set("date", selectedDate);
        }

        params.set("cityId", selectedCity.city_id);

        if (selectedZone?.zone_id) {
          params.set("zoneId", selectedZone.zone_id);
        }

        if (selectedDivision?.division_id) {
          params.set(
            "divisionId",
            selectedDivision.division_id
          );
        }

        /*
        |--------------------------------------------------------------------------
        | REQUEST
        |--------------------------------------------------------------------------
        */

        if (!cancelled) {
          setLoading(true);
          setError("");
        }

        const response = await api.get(
          `/api/waste-generators/gvp-trend?${params.toString()}`
        );

        if (cancelled) {
          return;
        }

        /*
        |--------------------------------------------------------------------------
        | NORMALIZE RESPONSE
        |--------------------------------------------------------------------------
        */

        const raw =
          response?.data?.data ??
          response?.data ??
          [];

        const rows = Array.isArray(raw) ? raw : [];

        /*
        |--------------------------------------------------------------------------
        | NORMALIZE WARD DATA
        |--------------------------------------------------------------------------
        */

        const normalized = rows
          .map((row, index) => {
            const wardNo = Number(
              row?.wardNo ??
                row?.ward_no ??
                0
            );

            const wardName = String(
              row?.wardName ??
                row?.ward_name ??
                `Ward ${wardNo || index + 1}`
            );

            const value = Number(
              row?.gvp ??
                row?.value ??
                row?.totalGVP ??
                row?.totalGvp ??
                0
            );

            return {
              wardNo,

              wardName,

              value: Number.isFinite(value)
                ? value
                : 0,
            };
          })

          /*
          |--------------------------------------------------------------------------
          | SORT BY WARD NUMBER
          |--------------------------------------------------------------------------
          */

          .sort(
            (a, b) =>
              Number(a.wardNo || 0) -
              Number(b.wardNo || 0)
          );

        setData(normalized);
      } catch (err) {
        console.error("GVP Trend Error:", err);

        if (!cancelled) {
          setData([]);

          setError(
            err?.response?.data?.message ||
              t(
                "wasteGenerators.gvp.error",
                "Unable to load GVP trend"
              )
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadGVP();

    return () => {
      cancelled = true;
    };
  }, [
    selectedDate,
    selectedCity?.city_id,
    selectedZone?.zone_id,
    selectedDivision?.division_id,
    t,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Y-AXIS DOMAIN
  |--------------------------------------------------------------------------
  |
  | Scale according to actual GVP data.
  |
  | No 6500 KG threshold is used.
  |--------------------------------------------------------------------------
  */

  const yDomain = useMemo(() => {
    if (!data.length) {
      return [0, 100];
    }

    const values = data
      .map((row) => Number(row.value || 0))
      .filter((value) =>
        Number.isFinite(value)
      );

    const maxValue =
      values.length > 0
        ? Math.max(...values)
        : 0;

    /*
    |--------------------------------------------------------------------------
    | ALL ZERO
    |--------------------------------------------------------------------------
    */

    if (maxValue <= 0) {
      return [0, 100];
    }

    /*
    |--------------------------------------------------------------------------
    | ADD 20% HEADROOM
    |--------------------------------------------------------------------------
    */

    const padded = maxValue * 1.2;

    /*
    |--------------------------------------------------------------------------
    | KEEP A REASONABLE MINIMUM
    |--------------------------------------------------------------------------
    */

    return [
      0,
      Math.max(10, Math.ceil(padded)),
    ];
  }, [data]);

  /*
  |--------------------------------------------------------------------------
  | TOOLTIP
  |--------------------------------------------------------------------------
  */

  const CustomTooltip = ({
    active,
    payload,
    label,
  }) => {
    if (
      !active ||
      !payload ||
      payload.length === 0
    ) {
      return null;
    }

    const value = Number(
      payload[0]?.value || 0
    );

    const wardNo =
      payload[0]?.payload?.wardNo;

    return (
      <div
        className="
          rounded-lg
          border
          border-slate-200
          bg-white
          px-4
          py-3
          shadow-lg
        "
      >
        <div className="text-[12px] font-semibold text-[#16295A]">
          {label}
        </div>

        {wardNo ? (
          <div className="mt-1 text-[11px] text-slate-500">
            {t(
              "wasteGenerators.gvp.wardNo",
              "Ward No"
            )}
            : {wardNo}
          </div>
        ) : null}

        <div className="mt-2 text-[13px] font-semibold text-green-600">
          {t(
            "wasteGenerators.gvp.gvp",
            "GVP"
          )}
          :{" "}
          {value.toLocaleString(
            undefined,
            {
              maximumFractionDigits: 2,
            }
          )}{" "}
          {t("units.kg", "KG")}
        </div>
      </div>
    );
  };

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <div
      className="
        w-full
        h-full
        min-h-[450px]
        rounded-[24px]
        border
        border-slate-200
        bg-white
        shadow-sm
        overflow-hidden
      "
    >
      {/* ================================================================
          HEADER
      ================================================================ */}

      <div className="flex items-center justify-between px-6 pt-5 pb-3">
        <h2 className="text-[18px] font-semibold text-[#16295A]">
          {t(
            "wasteGenerators.gvp.title",
            "GVP Generation Trend"
          )}
        </h2>

        <span className="text-[12px] text-slate-500">
          {selectedDate || ""}
        </span>
      </div>

      {/* ================================================================
          CONTENT
      ================================================================ */}

      <div className="px-4 pb-5">
        {/* ==============================================================
            GRAPH POSITION

            The graph has intentionally been moved downward.
            Everything else remains unchanged.
        ============================================================== */}

        <div
          className="
            relative
            top-[40px]
            w-full
            h-[370px]
          "
        >
          {loading ? (
            <div className="flex h-full items-center justify-center text-sm text-slate-400">
              {t(
                "wasteGenerators.gvp.loading",
                "Loading GVP data..."
              )}
            </div>
          ) : error ? (
            <div className="flex h-full items-center justify-center text-sm text-red-500">
              {error}
            </div>
          ) : data.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-slate-400">
              {t(
                "wasteGenerators.gvp.empty",
                "No GVP data available for the selected date and division."
              )}
            </div>
          ) : (
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <LineChart
                data={data}
                margin={{
                  top: 20,
                  right: 25,
                  left: 10,
                  bottom: 70,
                }}
              >
                {/* ======================================================
                    GRID
                ====================================================== */}

                <CartesianGrid
                  stroke="#E9EEF5"
                  strokeDasharray="0"
                  vertical={false}
                />

                {/* ======================================================
                    X AXIS — WARDS
                ====================================================== */}

                <XAxis
                  dataKey="wardName"
                  interval="preserveStartEnd"
                  tick={{
                    fontSize: 10,
                    fill: "#475569",
                    fontWeight: 500,
                  }}
                  axisLine={false}
                  tickLine={false}
                  angle={-25}
                  textAnchor="end"
                  height={75}
                />

                {/* ======================================================
                    Y AXIS — GVP KG
                ====================================================== */}

                <YAxis
                  domain={yDomain}
                  allowDataOverflow={false}
                  tick={{
                    fontSize: 11,
                    fill: "#475569",
                  }}
                  axisLine={false}
                  tickLine={false}
                  width={50}
                  tickFormatter={(value) => {
                    if (value >= 1000) {
                      return `${(
                        value / 1000
                      ).toFixed(
                        value >= 10000
                          ? 0
                          : 1
                      )}K`;
                    }

                    return value;
                  }}
                />

                {/* ======================================================
                    TOOLTIP
                ====================================================== */}

                <Tooltip
                  content={
                    <CustomTooltip />
                  }
                  cursor={{
                    stroke: "#CBD5E1",
                    strokeDasharray:
                      "4 4",
                  }}
                />

                {/* ======================================================
                    GVP LINE
                ====================================================== */}

                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#16A34A"
                  strokeWidth={2.5}
                  dot={{
                    r: 4,
                    fill: "#16A34A",
                    stroke: "#FFFFFF",
                    strokeWidth: 2,
                  }}
                  activeDot={{
                    r: 6,
                    fill: "#16A34A",
                    stroke: "#FFFFFF",
                    strokeWidth: 2,
                  }}
                  animationBegin={150}
                  animationDuration={700}
                  animationEasing="ease-out"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}