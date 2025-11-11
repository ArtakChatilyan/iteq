import { useEffect, useState } from "react";
import { format, subDays } from "date-fns";
import { visitsAPI } from "../../dal/api";
import styles from "./Analytics.module.css";
import { useTranslation } from "react-i18next";

const Analytics = () => {
  const { t } = useTranslation();
  const [summary, setSummary] = useState(null);
  const [topPages, setTopPages] = useState([]);
  const [countries, setCountries] = useState([]);
  const [timeseries, setTimeseries] = useState([]);
  const [range, setRange] = useState({
    start: format(subDays(new Date(), 7), "yyyy-MM-dd"),
    end: format(new Date(), "yyyy-MM-dd"),
  });

  useEffect(() => {
    visitsAPI
      .getSummary()
      .then((response) => {
        setSummary(response.data);
      })
      .catch((error) => console.log(error))
      .finally(() => {});
    getTopPages(range.start, range.end);
    getCountries(range.start, range.end);
    getTimeSeries(range.start, range.end);
  }, []);

  function getTopPages(start, end) {
    visitsAPI
      .getPages(start, end)
      .then((response) => {
        setTopPages(response.data);
      })
      .catch((error) => console.log(error))
      .finally(() => {});
  }

  function getCountries(start, end) {
    visitsAPI
      .getCountries(start, end)
      .then((response) => {
        setCountries(response.data);
      })
      .catch((error) => console.log(error))
      .finally(() => {});
  }

  function getTimeSeries(start, end) {
    visitsAPI
      .getTimeSeries(start, end)
      .then((response) => {
        // convert to chart-friendly array, fill missing dates
        const dataArray = Array.isArray(response.data)
          ? response.data
          : response.data.rows || [];
        const days = [];
        const s = new Date(start);
        const e = new Date(end);

        for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
          const ds = format(new Date(d), "yyyy-MM-dd");

          // Convert row.day to date string
          const row = dataArray.find(
            (x) => format(new Date(x.day), "yyyy-MM-dd") === ds
          );

          const cnt = row ? row.cnt : 0;
          days.push({ day: ds, cnt });
        }
        setTimeseries(days);
      })
      .catch((error) => console.log(error))
      .finally(() => {});
  }
  const maxTimeCount = Math.max(...timeseries.map((t) => t.cnt), 1);
  const maxPagesCount = Math.max(...topPages.map((t) => t.cnt), 1);
  const maxCountryCount = Math.max(...countries.map((t) => t.cnt), 1);

  return (
    <div className={styles.dashboardContainer}>
      {/* <h1
        style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "16px" }}
      >
        Analytics Dashboard
      </h1> */}

      {/* Summary Cards */}
      <div className={styles.cardsGrid}>
        <div className={`${styles.card} ${styles.cardBlue}`}>
          <div style={{fontSize:"1.6rem", marginBottom:"1rem"}}>{t("totalVisits")}</div>
          <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            {summary?.total}
          </div>
        </div>
        <div className={`${styles.card} ${styles.cardGreen}`}>
          <div style={{fontSize:"1.6rem", marginBottom:"1rem"}}>{t("uniqueIPs")}</div>
          <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            {summary?.uniqueIps}
          </div>
        </div>
        <div className={`${styles.card} ${styles.cardPurple}`}>
          <div  style={{fontSize:"1.6rem", marginBottom:"1rem"}}>{t("visitsToday")}</div>
          <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            {summary?.today}
          </div>
        </div>
      </div>

      {/* Visits per Day */}
      <TableWithProgress
        title={t("visitsDay")}
        data={timeseries}
        valueKey="cnt"
        labelKey="day"
        valueTranslation={t("analyticsCount")}
        labelTranslation={t("day")}
        maxValue={maxTimeCount}
        colorClass={styles.progressBarFill}
        range={range}
        setRange={setRange}
        onLoad={() => getTimeSeries(range.start, range.end)}
      />

      {/* Top Pages */}
      <TableWithProgress
        title={t("visitsPages")}
        data={topPages}
        valueKey="cnt"
        labelKey="page_url"
        valueTranslation={t("analyticsCount")}
        labelTranslation={t("pageUrl")}
        maxValue={maxPagesCount}
        colorClass={styles.progressBarFill}
      />

      {/* Visits by Country */}
      <TableWithProgress
        title={t("visitsCountries")}
        data={countries}
        valueKey="cnt"
        labelKey="country"
        valueTranslation={t("analyticsCount")}
        labelTranslation={t("analyticsCountry")}
        maxValue={maxCountryCount}
        colorClass={styles.progressBarFillCountry}
      />
    </div>
  );
};

export default Analytics;

function TableWithProgress({
  title,
  data,
  valueKey,
  labelKey,
  maxValue,
  colorClass,
  range,
  setRange,
  onLoad,
  valueTranslation,
  labelTranslation
}) {
    const { t } = useTranslation();
  return (
    <div className={styles.tableContainer}>
      <h2 style={{ fontWeight: "bold",fontSize:"2rem", marginBottom: "18px" }}>{title}</h2>

      {/* Optional date range picker */}
      {range && setRange && onLoad && (
        <div style={{ marginBottom: "8px", display: "flex", gap: "8px" }}>
          <input
            type="date"
            value={range.start}
            onChange={(e) => setRange((r) => ({ ...r, start: e.target.value }))}
          />
          <input
            type="date"
            value={range.end}
            onChange={(e) => setRange((r) => ({ ...r, end: e.target.value }))}
          />
          <button onClick={onLoad} style={{ padding: "4px 12px" }}>
            {t("load")}
          </button>
        </div>
      )}

      <table className={styles.table}>
        <thead>
          <tr>
            <th style={{textAlign:"center"}}>{labelTranslation}</th>
            <th style={{textAlign:"center"}}>{valueTranslation}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              <td>{row[labelKey]}</td>
              <td>
                <div className={styles.progressBarBackground}>
                  <div
                    className={colorClass}
                    style={{ width: `${(row[valueKey] / maxValue) * 100}%` }}
                  />
                </div>
                <span style={{ marginLeft: "8px", fontSize: "12px" }}>
                  {row[valueKey]}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
