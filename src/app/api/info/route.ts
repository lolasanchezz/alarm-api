import { NextResponse, NextRequest } from "next/server";

import { createClient } from "../utils/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);
    const res: any = {};

  const { data: alarms } = await supabase.from("alarms").select();

  return NextResponse.json({
    ok: true,
    alarms:alarms
  });
}

export async function POST(req: NextRequest) {
  /* 
 structure of request: {
 alarms = []
 messages = []
 }
 */

  const res: any = {};
  const reqData = await req.json();
  if (reqData.alarms != undefined) {
    const cookieStore = cookies();
    const supabase = await createClient(cookieStore);
    console.log(reqData.alarms)
    const { data: alarms } = await supabase
      .from("alarms")
      .insert(reqData.alarms)
      .select();
    res.alarmsAdded = alarms;
  }
  res.ok = true;
  console.log(res)
  return NextResponse.json({
    res,
  });
}

export async function DELETE(req: NextRequest) {
  /*
  alarms: 1 (delete 1)
  */
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);
    const res: any = {};

  const reqData = await req.json();
  console.log(reqData)
  if (reqData.alarms != undefined) {
   const { data: alarms, error } = await supabase
      .from("alarms")
      .delete()
      .eq("id", reqData.alarms.id)
      .select();
    res.newAlarms = alarms
  
  if (error) {
    console.error(error)
    res.statusText = error
    return res
  }
}
  res.ok = true
  console.log(res)

  return NextResponse.json({
    res
  });
}
