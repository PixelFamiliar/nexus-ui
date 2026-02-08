"use client";

import { useState, useEffect } from 'react';

// This is a bridge between the local activity log and the UI
// until Convex is fully configured.

export function useActivities(limit = 20) {
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch('/api/activity-logs');
        if (response.ok) {
          const data = await response.json();
          setActivities(data.slice(-limit).reverse());
        }
      } catch (e) {
        console.error("Failed to fetch logs", e);
      }
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, [limit]);

  return activities;
}

export function useTasks() {
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/tasks');
        if (response.ok) {
          const data = await response.json();
          setTasks(data);
        }
      } catch (e) {
        console.error("Failed to fetch tasks", e);
      }
    };

    fetchTasks();
    const interval = setInterval(fetchTasks, 60000);
    return () => clearInterval(interval);
  }, []);

  return tasks;
}

export function useGlobalSearch(searchTerm: string) {
  const [results, setResults] = useState<any>({ memories: [], tasks: [] });

  useEffect(() => {
    if (!searchTerm || searchTerm.length < 2) {
      setResults({ memories: [], tasks: [] });
      return;
    }

    const search = async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`);
        if (response.ok) {
          const data = await response.json();
          setResults(data);
        }
      } catch (e) {
        console.error("Search failed", e);
      }
    };

    const timeout = setTimeout(search, 300);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  return results;
}
