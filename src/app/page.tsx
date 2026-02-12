"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { NextResponse, NextRequest } from "next/server";

export default function Home() {
  return (
    <div className={styles.page}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const dateValue = (
            form.elements.namedItem("date") as HTMLInputElement
          ).value;

          fetch("/api/info", {
            method: "POST",
            body: JSON.stringify({
              alarms: [{ time: dateValue, label: "thing2" }],
            }),
          });
        }}
      >
        <input type="text" name="date" />
      </form>
    </div>
  );
}
