import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { type NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { sql } from "drizzle-orm";
import { db } from "@/db";

dayjs.extend(utc);
dayjs.extend(timezone);

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const tz = searchParams.get("tz") as string;
  const languageCode = searchParams.get("languageCode");

  // Database created_at is in UTC

  const startCurrentMonth = dayjs().tz(tz).startOf("month");
  const startPrevious1Month = dayjs().tz(tz).startOf("month").subtract(1, "month");
  const startPrevious2Month = dayjs().tz(tz).startOf("month").subtract(2, "month");
  const startPrevious3Month = dayjs().tz(tz).startOf("month").subtract(3, "month");
  const startPrevious4Month = dayjs().tz(tz).startOf("month").subtract(4, "month");

  const startPrevious4Day = dayjs().tz(tz).startOf("day").subtract(4, "days");
  const startPrevious3Day = dayjs().tz(tz).startOf("day").subtract(3, "days");
  const startPrevious2Day = dayjs().tz(tz).startOf("day").subtract(2, "days");
  const startPrevious1Day = dayjs().tz(tz).startOf("day").subtract(1, "day");
  const startCurrentDay = dayjs().tz(tz).startOf("day");


  // TODO use drizzle properly and optimize

  // More gratifying to show cumulative counts
  const currentMonthWordsQuery = db.execute(
    sql`select count(id) as count from words where language_code = ${languageCode} and user_id = ${session.user.id}`
  );
  const previous1MonthWordsQuery = db.execute(
    sql`select count(id) as count from words where language_code = ${languageCode} and user_id = ${session.user.id} and created_at < ${startCurrentMonth.toISOString()}`
  );
  const previous2MonthWordsQuery = db.execute(
    sql`select count(id) as count from words where language_code = ${languageCode} and user_id = ${session.user.id} and created_at < ${startPrevious1Month.toISOString()}`
  );
  const previous3MonthWordsQuery = db.execute(
    sql`select count(id) as count from words where language_code = ${languageCode} and user_id = ${session.user.id} and created_at < ${startPrevious2Month.toISOString()}`
  );
  const previous4MonthWordsQuery = db.execute(
    sql`select count(id) as count from words where language_code = ${languageCode} and user_id = ${session.user.id} and created_at < ${startPrevious3Month.toISOString()}`
  );

  const currentDayPlaybackQuery = db.execute(
    sql`select count(id) as count from events where language_code = ${languageCode} and user_id = ${session.user.id} and type = 'minutePlayed' and created_at >= ${startCurrentDay.toISOString()}`
  );
  const previous1DayPlaybackQuery = db.execute(
    sql`select count(id) as count from events where language_code = ${languageCode} and user_id = ${session.user.id} and type = 'minutePlayed' and created_at BETWEEN ${startPrevious1Day.toISOString()} AND ${startCurrentDay.toISOString()}`
  );
  const previous2DayPlaybackQuery = db.execute(
    sql`select count(id) as count from events where language_code = ${languageCode} and user_id = ${session.user.id} and type = 'minutePlayed' and created_at BETWEEN ${startPrevious2Day.toISOString()} AND ${startPrevious1Day.toISOString()}`
  );
  const previous3DayPlaybackQuery = db.execute(
    sql`select count(id) as count from events where language_code = ${languageCode} and user_id = ${session.user.id} and type = 'minutePlayed' and created_at BETWEEN ${startPrevious3Day.toISOString()} AND ${startPrevious2Day.toISOString()}`
  );
  const previous4DayPlaybackQuery = db.execute(
    sql`select count(id) as count from events where language_code = ${languageCode} and user_id = ${session.user.id} and type = 'minutePlayed' and created_at BETWEEN ${startPrevious4Day.toISOString()} AND ${startPrevious3Day.toISOString()}`
  );

  const counts = await Promise.all([
    currentMonthWordsQuery,
    previous1MonthWordsQuery,
    previous2MonthWordsQuery,
    previous3MonthWordsQuery,
    previous4MonthWordsQuery,
    currentDayPlaybackQuery,
    previous1DayPlaybackQuery,
    previous2DayPlaybackQuery,
    previous3DayPlaybackQuery,
    previous4DayPlaybackQuery,
  ]);

  return Response.json({
    words: [
      { x: startPrevious4Month.format("MMMM"), y: Number(counts[4].rows[0].count) },
      { x: startPrevious3Month.format("MMMM"), y: Number(counts[3].rows[0].count) },
      { x: startPrevious2Month.format("MMMM"), y: Number(counts[2].rows[0].count) },
      { x: startPrevious1Month.format("MMMM"), y: Number(counts[1].rows[0].count) },
      { x: startCurrentMonth.format("MMMM"), y: Number(counts[0].rows[0].count) },
    ],
    playback: [
      { x: startPrevious4Day.format("dddd"), y: Number(counts[9].rows[0].count) },
      { x: startPrevious3Day.format("dddd"), y: Number(counts[8].rows[0].count) },
      { x: startPrevious2Day.format("dddd"), y: Number(counts[7].rows[0].count) },
      { x: "Yesterday", y: Number(counts[6].rows[0].count) },
      { x: "Today", y: Number(counts[5].rows[0].count) },
    ],
    // words: [
    //   { x: startPrevious4Month.format("MMMM"), y: 67 },
    //   { x: startPrevious3Month.format("MMMM"), y: 70 },
    //   { x: startPrevious2Month.format("MMMM"), y: 88 },
    //   { x: startPrevious1Month.format("MMMM"), y: 500 },
    //   { x: startCurrentMonth.format("MMMM"), y: 550 },
    // ],
    // playback: [
    //   { x: startPrevious4Day.format("dddd"), y: 786 },
    //   { x: startPrevious3Day.format("dddd"), y: 78 },
    //   { x: startPrevious2Day.format("dddd"), y: 7 },
    //   { x: "Yesterday", y: 7 },
    //   { x: "Today", y: 76 },
    // ],
  });
}
