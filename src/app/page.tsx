"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { NextResponse, NextRequest } from "next/server";
import Calendar from "react-calendar";
import { useEffect, useState } from "react";
const months: { [key: string]: number } = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  oct: 9,
  nov: 10,
  dec: 11,
};

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function parseDateTime(dateStr: string): number {
  const monthName = dateStr.substring(5, 8);
  const day = dateStr.substring(9, 11).trim();
  const timeStr = dateStr.substring(12);
  const hour = parseInt(timeStr.split(":")[0]);
  const minutes = timeStr.substring(
    timeStr.indexOf(":") + 1,
    timeStr.indexOf(":") + 3,
  );
  const ampm = timeStr.slice(-2);

  const month = months[monthName.toLowerCase()];
  let hourAdjusted = hour;
  if (ampm.toLowerCase() === "pm" && hourAdjusted !== 12) {
    hourAdjusted += 12;
  } else if (ampm.toLowerCase() === "am" && hourAdjusted === 12) {
    hourAdjusted = 0;
  }

  const date = new Date();
  date.setFullYear(2026);
  date.setMonth(month);
  date.setDate(parseInt(day));
  date.setHours(hourAdjusted);
  date.setMinutes(parseInt(minutes));
  date.setSeconds(0);
  date.setMilliseconds(0);

  return date.getTime();
}

function formatDateTime(timestamp: number): string {
  const date = new Date(timestamp);
  const dayName = dayNames[date.getDay()];
  const monthName = monthNames[date.getMonth()];
  const day = date.getDate();
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "pm" : "am";

  // Convert to 12-hour format
  hours = hours % 12 || 12;

  return `${dayName}, ${monthName} ${day} ${hours}:${minutes}${ampm}`;
}

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [data, setData] = useState<any>(undefined);

  const today = new Date();
  const nextWeek = new Date(today);
  const options = { weekday: "short", month: "long", day: "numeric" } as const;

  nextWeek.setDate(nextWeek.getDate() + 7);
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/info", { method: "GET" });
      const result = await response.json();
      setData(result);
    };
    fetchData();
  }, []);
  return (
    <div className={styles.page}>
      <div className={styles.alarmCont1}>
        <h1 className={styles.header}>set alarm</h1>
        <div className={styles.selDatesDiv}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.target;
              const formData = new FormData(form);
              const formProps = Object.fromEntries(formData);

              fetch("/api/info", {
                method: "POST",
                body: JSON.stringify({
                  alarms: { time: parseDateTime(formProps.timeInp as string) },
                }),
              });
              setData({
                ...data,
                alarms: [
                  ...data.alarms,
                  { time: parseDateTime(formProps.timeInp as string) },
                ],
              });
            }}
          >
            <input
              name="timeInp"
              type="text"
              defaultValue="Thu, Feb 12 9:00am"
            />
          </form>
        </div>
      </div>
      <div className={styles.alarmList}>
        <h1 className={styles.header}>alarms</h1>
        <div className={styles.scrollDiv}>
          {!data
            ? "loading"
            : data.alarms.map((row: any, i: number) => {
                console.log(data);
                return (
                  <div className={styles.row} key={i}>
                    <p
                      onClick={async () => {
                        console.log('deleting')
                        console.log(row)
                        const res = await fetch("/api/info", {
                          method: "DELETE",
                          body: JSON.stringify({
                            alarms: row,
                          }),
                        });
                        const resJs = await res.json();

                        console.log(resJs);
                        setData({ ...data, alarms: resJs.res.newAlarms });
                      }}
                    >
                      x
                    </p>
                    <h3>{formatDateTime(row.time)}</h3>
                  </div>
                );
              })}
        </div>
      </div>
    </div>
  );
}
