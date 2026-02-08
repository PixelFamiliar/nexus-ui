import { NextResponse } from 'next/server';

export async function GET() {
  // We can't call tools directly from Next.js server, but we can read the state or a file
  // For now, I'll create a script that dumps the cron jobs to a file for the API to read
  const cronFile = "/Users/scott/clawd/state/cron_jobs.json";
  
  try {
    if (require('fs').existsSync(cronFile)) {
      const data = require('fs').readFileSync(cronFile, 'utf8');
      const jobs = JSON.parse(data).jobs;
      
      const formattedTasks = jobs.map((job: any) => ({
        _id: job.id,
        title: job.name || "Unnamed Task",
        startTime: job.state?.nextRunAtMs || Date.now(),
        type: job.schedule.kind,
        status: job.enabled ? "scheduled" : "disabled"
      }));
      
      return NextResponse.json(formattedTasks);
    }
    return NextResponse.json([]);
  } catch (error) {
    return NextResponse.json([]);
  }
}
