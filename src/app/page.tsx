"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { NextResponse, NextRequest } from "next/server";
import Calendar from "react-calendar";
import { useEffect, useState } from "react";

function parseDateTime(dateStr: string): number {
  // parse format: "Thu, Feb 12 9:00am"
  const regex = /\w+,\s+(\w+)\s+(\d+)\s+(\d+):(\d+)(am|pm)/i;
  const match = dateStr.match(regex);

  if (!match) {
    throw new Error("Invalid date format");
  }

  const [, monthName, day, hours, minutes, ampm] = match;

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

  const month = months[monthName.toLowerCase().slice(0, 3)];
  let hour = parseInt(hours);

  // Convert to 24-hour format
  if (ampm.toLowerCase() === "pm" && hour !== 12) {
    hour += 12;
  } else if (ampm.toLowerCase() === "am" && hour === 12) {
    hour = 0;
  }

  const date = new Date();
  date.setMonth(month);
  date.setDate(parseInt(day));
  date.setHours(hour);
  date.setMinutes(parseInt(minutes));
  date.setSeconds(0);
  date.setMilliseconds(0);

  return date.getTime();
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
      const response = await fetch('/api/info', {method: 'GET'})
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

              fetch('/api/info', {method: 'POST', body: JSON.stringify(
                {alarms: [
                  {time: parseDateTime(formProps.timeInp as string)}]
              })
            })}}>
            <input
              name="timeInp"
              type="text"
              defaultValue="Thu, Feb 12 9:00am"
            />
          </form>
        </div>
      </div>
      <div className={styles.alarmList}>
        <h1 className= {styles.header}>alarms</h1>
      <div className = {styles.scrollDiv}>
        {!data? 'loading' : data.alarms.map((row: any, i: number) => {
          
            <div key={i}>
              <h3>{row}</h3>
            </div>
          
        })}
      </div>
    </div>
    </div>
  );
}
