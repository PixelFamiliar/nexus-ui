import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("activities")
      .withIndex("by_timestamp")
      .order("desc")
      .take(args.limit ?? 50);
  },
});

export const log = mutation({
  args: {
    agent: v.string(),
    action: v.string(),
    details: v.string(),
    status: v.string(),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("activities", {
      timestamp: Date.now(),
      ...args,
    });
  },
});
