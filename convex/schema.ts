import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  activities: defineTable({
    timestamp: v.number(),
    agent: v.string(),
    action: v.string(),
    details: v.string(),
    status: v.string(), // "success" | "error" | "info" | "pending"
    metadata: v.optional(v.any()),
  }).index("by_timestamp", ["timestamp"]),

  scheduled_tasks: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    startTime: v.number(),
    endTime: v.optional(v.number()),
    type: v.string(), // "cron" | "reminder" | "task"
    status: v.string(), // "scheduled" | "completed" | "cancelled"
    recurrence: v.optional(v.string()),
  }).index("by_start_time", ["startTime"]),

  memories: defineTable({
    title: v.string(),
    content: v.string(),
    tags: v.array(v.string()),
    lastModified: v.number(),
    source: v.string(), // "MEMORY.md" | "file" | "conversation"
  }).searchIndex("search_content", {
    searchField: "content",
    filterFields: ["title", "source"],
  }),
});
