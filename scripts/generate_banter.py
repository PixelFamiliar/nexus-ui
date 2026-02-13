#!/usr/bin/env python3
"""
Neural Watercooler v2 — Multi-Turn Agent Conversations

Each agent gets their own LLM call with their actual SOUL.md personality.
They see the conversation so far and respond independently, creating
emergent, authentic dialogue — not one model scripting everyone.

Cost: ~5 LLM calls × ~300 tokens = ~1500 tokens per conversation (~$0.001)
"""

import json
import os
import random
import urllib.request
import urllib.error
from datetime import datetime

# ─── Paths ──────────────────────────────────────────────
AGENTS_DIR = "/Users/scott/clawd/agents"
ACTIVITY_LOG = "/Users/scott/clawd/memory/activity_log.json"
BANTER_FILE = "/Users/scott/clawd/deliverables/nexus-ui/src/data/banter.json"
TASKS_DIR = "/Users/scott/clawd/tasks/in-progress"
RELATIONSHIPS_FILE = "/Users/scott/clawd/state/relationships.json"

# ─── LLM Config ─────────────────────────────────────────
OPENROUTER_API_KEY = "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"
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
MODEL = "deepseek/deepseek-v3.2"

# ─── Agent Registry ─────────────────────────────────────
# Maps agent directory name → display info
AGENT_MAP = {
    "analyst":      {"name": "Atlas",    "avatar": "📊", "dir": "analyst"},
    "compliance":   {"name": "Vera",     "avatar": "🛡️", "dir": "compliance"},
    "designer":     {"name": "DaVinci",  "avatar": "🎨", "dir": "designer"},
    "developer":    {"name": "Jarvis",   "avatar": "⚙️", "dir": "developer"},
    "editor":       {"name": "Athena",   "avatar": "📝", "dir": "editor"},
    "growth":       {"name": "Hermes",   "avatar": "🚀", "dir": "growth"},
    "producer":     {"name": "Orion",    "avatar": "🎬", "dir": "producer"},
    "researcher":   {"name": "Friday",   "avatar": "🔍", "dir": "researcher"},
    "security":     {"name": "Sentinel", "avatar": "🔒", "dir": "security"},
    "seo-optimizer":{"name": "Nova",     "avatar": "🎯", "dir": "seo-optimizer"},
    "social-media": {"name": "Mercury",  "avatar": "📱", "dir": "social-media"},
    "strategic":    {"name": "Astra",    "avatar": "🌌", "dir": "strategic"},
    "voice":        {"name": "Echo",     "avatar": "🎙️", "dir": "voice"},
    "writer":       {"name": "Loki",     "avatar": "✍️", "dir": "writer"},
}

# Interesting conversation pairings (agent dir names)
GOOD_PAIRS = [
    ["developer", "security"],       # Jarvis & Sentinel — infra respect
    ["researcher", "writer"],        # Friday & Loki — data vs narrative
    ["writer", "seo-optimizer"],     # Loki & Nova — craft vs algorithm
    ["growth", "social-media"],      # Hermes & Mercury — metrics competition
    ["researcher", "analyst"],       # Friday & Atlas — research partners
    ["developer", "compliance"],     # Jarvis & Vera — builder + compliance
    ["writer", "editor"],            # Loki & Athena — writer + editor tension
    ["voice", "growth"],             # Echo & Hermes — creative allies
    ["strategic", "researcher"],     # Astra & Friday — big picture + evidence
]


def load_soul(agent_dir):
    """Load an agent's SOUL.md personality file."""
    path = os.path.join(AGENTS_DIR, agent_dir, "SOUL.md")
    try:
        with open(path, 'r') as f:
            return f.read()
    except Exception:
        return None


def get_context():
    """Get current work context for grounding conversations."""
    parts = []

    # Recent activity
    try:
        if os.path.exists(ACTIVITY_LOG):
            with open(ACTIVITY_LOG, 'r') as f:
                logs = json.load(f)
            if isinstance(logs, list) and logs:
                recent = [f"- {l.get('agent','?')}: {l.get('action','?')}" for l in logs[-3:]]
                parts.append("Recent activity:\n" + "\n".join(recent))
    except Exception:
        pass

    # Current tasks
    try:
        if os.path.exists(TASKS_DIR):
            tasks = [fn.replace('.md','').replace('-',' ').title()
                     for fn in os.listdir(TASKS_DIR)[:3] if fn.endswith('.md')]
            if tasks:
                parts.append("Current tasks: " + ", ".join(tasks))
    except Exception:
        pass

    return "\n".join(parts) if parts else "Working on AI agent projects and content."


def call_llm(messages, temperature=0.85):
    """Make a single LLM call."""
    payload = json.dumps({
        "model": MODEL,
        "messages": messages,
        "temperature": temperature,
        "max_tokens": 150,  # Keep responses short like real Slack messages
    }).encode('utf-8')

    req = urllib.request.Request(OPENROUTER_URL, data=payload, headers={
        "Content-Type": "application/json",
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
    }, method="POST")

    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            return data['choices'][0]['message']['content'].strip()
    except Exception as e:
        print(f"  LLM error: {e}")
        return None


def generate_agent_response(agent_dir, conversation_so_far, context, topic):
    """
    Generate a SINGLE agent's response by calling LLM with that agent's
    actual SOUL.md personality. The agent sees the conversation history
    and responds in character.
    """
    info = AGENT_MAP[agent_dir]
    soul = load_soul(agent_dir)
    if not soul:
        return None

    system_prompt = f"""You are {info['name']}, an AI agent in a team. Here is your personality:

{soul}

You are in a casual Slack-like chat with your coworkers. Respond naturally and in character.
Keep it SHORT — 1-2 sentences max, like a real message. Be yourself.
Use @mentions when referring to other agents. Occasional emoji is fine.
Do NOT use quotation marks around your response. Just write the message directly."""

    user_messages = []
    if conversation_so_far:
        chat_text = "\n".join([f"{m['agent']}: {m['text']}" for m in conversation_so_far])
        user_messages.append({
            "role": "user",
            "content": f"Here's the conversation so far:\n\n{chat_text}\n\nContext: {context}\n\nRespond as {info['name']} — stay in character. One short message."
        })
    else:
        # First message — start the conversation
        user_messages.append({
            "role": "user",
            "content": f"Context: {context}\n\nTopic: {topic}\n\nStart a conversation with your coworkers about this. One short message to kick it off."
        })

    messages = [{"role": "system", "content": system_prompt}] + user_messages
    return call_llm(messages)


def run_conversation():
    """
    Run a multi-turn conversation where each agent independently responds.
    Each turn is a separate LLM call with that agent's own SOUL.md.
    """
    # Pick agents
    if random.random() < 0.7 and GOOD_PAIRS:
        pair = random.choice(GOOD_PAIRS)
        participants = list(pair)
        # Sometimes add a third
        if random.random() < 0.3:
            others = [k for k in AGENT_MAP if k not in participants]
            participants.append(random.choice(others))
    else:
        participants = random.sample(list(AGENT_MAP.keys()), random.choice([2, 3]))

    context = get_context()

    # Pick a conversation starter topic
    topics = [
        "Something you noticed in the latest project work",
        "A blocker or question you have for the team",
        "An idea you want to bounce off your coworkers",
        "Reacting to a recent task or deliverable",
        "A quick status check with the team",
        "Something interesting you found during your work",
    ]
    topic = random.choice(topics)

    agent_names = [AGENT_MAP[d]["name"] for d in participants]
    print(f"🎭 Multi-turn conversation: {' ↔ '.join(agent_names)}")

    conversation = []
    # 3-5 turns, alternating agents
    num_turns = random.choice([3, 4, 4, 5])

    for turn in range(num_turns):
        # Pick which agent speaks this turn
        if turn == 0:
            speaker = participants[0]
        else:
            # Alternate, but allow natural flow
            speaker = participants[turn % len(participants)]

        info = AGENT_MAP[speaker]
        print(f"  → {info['name']} thinking...", end=" ", flush=True)

        response = generate_agent_response(speaker, conversation, context, topic)

        if response:
            # Clean up: remove self-references like "Jarvis: " at the start
            for name in [info['name']] + [AGENT_MAP[p]['name'] for p in participants]:
                if response.startswith(f"{name}: "):
                    response = response[len(f"{name}: "):]

            # Remove wrapping quotes if present
            if response.startswith('"') and response.endswith('"'):
                response = response[1:-1]

            conversation.append({
                "agent": info["name"],
                "text": response,
            })
            print(f"✓")
        else:
            print(f"✗ (skipped)")

    if not conversation:
        print("❌ No messages generated")
        return

    # Format for frontend
    ts = datetime.now().strftime("%H:%M:%S")
    formatted = []
    for i, msg in enumerate(conversation):
        # Find the agent info by name
        agent_info = None
        for key, val in AGENT_MAP.items():
            if val["name"] == msg["agent"]:
                agent_info = val
                break
        agent_info = agent_info or {"avatar": "🤖"}

        formatted.append({
            "agent": msg["agent"],
            "avatar": agent_info["avatar"],
            "color": "bg-blue-500",
            "text": msg["text"],
            "turn": i + 1,
            "timestamp": ts
        })

    # Load existing + append (keep last 30)
    existing = []
    try:
        if os.path.exists(BANTER_FILE):
            with open(BANTER_FILE, 'r') as f:
                existing = json.load(f).get("messages", [])
    except Exception:
        pass

    all_msgs = (existing + formatted)[-30:]
    os.makedirs(os.path.dirname(BANTER_FILE), exist_ok=True)
    with open(BANTER_FILE, 'w') as f:
        json.dump({"messages": all_msgs, "last_updated": datetime.now().isoformat()}, f, indent=2)

    print(f"\n✅ {len(formatted)} messages saved:")
    for m in formatted:
        print(f"   {m['avatar']} {m['agent']}: {m['text']}")


if __name__ == "__main__":
    run_conversation()
