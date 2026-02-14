import { NextResponse, NextRequest } from "next/server";

import { createClient } from "../utils/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);
    const res: any = {};

  const { data: message } = await supabase.from("message").select();

  return NextResponse.json({
    ok: true,
    body: message
  });
}
