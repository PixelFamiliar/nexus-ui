import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const listScheduled = query({
  args: { 
    from: v.number(),
    to: v.number()
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("scheduled_tasks")
      .withIndex("by_start_time", (q) => 
        q.gte("startTime", args.from).lte("startTime", args.to)
      )
      .collect();
  },
});

export const add = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    startTime: v.number(),
    endTime: v.optional(v.number()),
    type: v.string(),
    status: v.string(),
    recurrence: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("scheduled_tasks", args);
  },
});
