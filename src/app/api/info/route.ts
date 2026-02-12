import { NextResponse } from "next/server"

let alarms = [
  {
    id: 1,
    time: "2026-02-14T07:30:00",
    label: "wake up"
  }
]

export async function GET() {
  return NextResponse.json(alarms)
}
