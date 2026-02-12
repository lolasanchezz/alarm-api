import { NextResponse, NextRequest } from "next/server"
import { readFile, writeFile } from "fs/promises"
import { join } from "path"

export async function GET(req: NextRequest) {
  const filePath = join(process.cwd(), "src/app/api/info/info.json")
  const fileContent = await readFile(filePath, "utf-8")
  const data = JSON.parse(fileContent)
  
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {

 /* 
 structure of request: {
 alarms = []
 messages = []
 }
 */

  const filePath = join(process.cwd(), "src/app/api/info/info.json")
  const fileContent = await readFile(filePath, "utf-8")
  const data = JSON.parse(fileContent)

  const reqData = await req.json()
  console.log(reqData)
  if (reqData.alarms != undefined) {
    data.alarms.push(...reqData.alarms)
    console.log()
  }
  if (reqData.messages != undefined) {
    data.messages.push(...reqData.messages)
  }

  await writeFile(filePath, JSON.stringify(data))

  return NextResponse.json({
    ok: true,
    alarmsAdded: Array.isArray(reqData.alarms) ? reqData.alarms.length : 0,
    messagesAdded: Array.isArray(reqData.messages) ? reqData.messages.length : 0,
  })

}