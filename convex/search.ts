import { v } from "convex/values";
import { query } from "./_generated/server";

export const globalSearch = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    if (!args.searchTerm) return [];

    const memoryResults = await ctx.db
      .query("memories")
      .withSearchIndex("search_content", (q) => 
        q.search("content", args.searchTerm)
      )
      .take(10);

    const taskResults = await ctx.db
      .query("scheduled_tasks")
      .filter((q) => q.contains(q.field("title"), args.searchTerm))
      .take(10);

    return {
      memories: memoryResults,
      tasks: taskResults,
    };
  },
});
