#!/usr/bin/env python3
"""
Agent Roundtable — Multi-Agent Task Collaboration

Picks a real task from /tasks/in-progress/, assembles the assigned agents,
and runs a structured multi-turn discussion where each agent contributes
their expertise to produce an actionable solution.

Each agent gets their own LLM call with their actual SOUL.md personality.
The output is saved to memory/roundtables/ AND streamed to banter.json.

Usage:
  python3 run_roundtable.py                  # Auto-pick a random task
  python3 run_roundtable.py --task <file>     # Specific task file
  python3 run_roundtable.py --auto            # Auto-detect new/changed tasks
"""

import json
import os
import sys
import random
import hashlib
import urllib.request
import urllib.error
from datetime import datetime

# ─── Paths ──────────────────────────────────────────────
AGENTS_DIR = "/Users/scott/clawd/agents"
TASKS_DIR = "/Users/scott/clawd/tasks/in-progress"
ROUNDTABLES_DIR = "/Users/scott/clawd/memory/roundtables"
BANTER_FILE = "/Users/scott/clawd/deliverables/nexus-ui/src/data/banter.json"
STATE_FILE = "/Users/scott/clawd/memory/roundtable-state.json"

# ─── LLM Config ─────────────────────────────────────────
OPENROUTER_API_KEY = "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"
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
MODEL = "deepseek/deepseek-v3.2"

# ─── Agent Registry ─────────────────────────────────────
AGENT_LOOKUP = {
    "jarvis":   {"name": "Jarvis",   "avatar": "⚙️",  "dir": "developer"},
    "friday":   {"name": "Friday",   "avatar": "🔍",  "dir": "researcher"},
    "loki":     {"name": "Loki",     "avatar": "✍️",  "dir": "writer"},
    "nova":     {"name": "Nova",     "avatar": "🎯",  "dir": "seo-optimizer"},
    "mercury":  {"name": "Mercury",  "avatar": "📱",  "dir": "social-media"},
    "echo":     {"name": "Echo",     "avatar": "🎙️",  "dir": "voice"},
    "atlas":    {"name": "Atlas",    "avatar": "📊",  "dir": "analyst"},
    "hermes":   {"name": "Hermes",   "avatar": "🚀",  "dir": "growth"},
    "vera":     {"name": "Vera",     "avatar": "🛡️",  "dir": "compliance"},
    "astra":    {"name": "Astra",    "avatar": "🌌",  "dir": "strategic"},
    "athena":   {"name": "Athena",   "avatar": "📝",  "dir": "editor"},
    "sentinel": {"name": "Sentinel", "avatar": "🔒",  "dir": "security"},
    "davinci":  {"name": "DaVinci",  "avatar": "🎨",  "dir": "designer"},
    "orion":    {"name": "Orion",    "avatar": "🎬",  "dir": "producer"},
    "pixel":    {"name": "Pixel",    "avatar": "👾",  "dir": None},  # Main agent, no sub-folder
    "designer": {"name": "DaVinci",  "avatar": "🎨",  "dir": "designer"},
}


def load_soul(agent_dir):
    """Load an agent's SOUL.md."""
    if not agent_dir:
        return "You are Pixel, the orchestrator. Coordinating, pragmatic, slightly playful. Keeps things moving."
    path = os.path.join(AGENTS_DIR, agent_dir, "SOUL.md")
    try:
        with open(path, 'r') as f:
            return f.read()
    except Exception:
        return None


def pick_task(specific_file=None):
    """Pick a task from in-progress."""
    if specific_file:
        path = os.path.join(TASKS_DIR, specific_file) if not specific_file.startswith('/') else specific_file
        if os.path.exists(path):
            with open(path, 'r') as f:
                return f.read(), os.path.basename(path)
    # Auto-pick
    try:
        tasks = [f for f in os.listdir(TASKS_DIR) if f.endswith('.md')]
        if tasks:
            chosen = random.choice(tasks)
            with open(os.path.join(TASKS_DIR, chosen), 'r') as f:
                return f.read(), chosen
    except Exception:
        pass
    return None, None


def extract_agents(task_content):
    """Extract assigned agents from task file."""
    agents = []
    for line in task_content.split('\n'):
        if 'assigned to' in line.lower():
            # Find @mentions
            import re
            mentions = re.findall(r'@(\w+)', line.lower())
            for m in mentions:
                if m in AGENT_LOOKUP:
                    agents.append(m)
    # Always include pixel as facilitator if not already there
    if 'pixel' not in agents:
        agents.insert(0, 'pixel')
    return agents[:5]  # Cap at 5 to keep costs reasonable


def call_llm(messages, max_tokens=200):
    """Make a single LLM call."""
    payload = json.dumps({
        "model": MODEL,
        "messages": messages,
        "temperature": 0.8,
        "max_tokens": max_tokens,
    }).encode('utf-8')

    req = urllib.request.Request(OPENROUTER_URL, data=payload, headers={
        "Content-Type": "application/json",
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
    }, method="POST")

    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            return data['choices'][0]['message']['content'].strip()
    except Exception as e:
        print(f"  LLM error: {e}")
        return None


def agent_respond(agent_key, task_content, conversation, phase):
    """
    Generate ONE agent's contribution to the task discussion.
    Each agent sees the task + conversation history + their role.
    """
    info = AGENT_LOOKUP[agent_key]
    soul = load_soul(info["dir"])
    if not soul:
        return None

    other_names = [AGENT_LOOKUP[k]["name"] for k in conversation
                   if k != agent_key] if isinstance(conversation, dict) else []

    phase_instruction = {
        "understand": "Read the task and share YOUR understanding of what needs to happen from YOUR role's perspective. What part is yours? What concerns do you have?",
        "propose": "Based on the discussion so far, propose your specific contribution. What will YOU do? Be concrete — mention specific tools, approaches, or steps.",
        "refine": "React to others' proposals. Do you see gaps? Conflicts? Suggest improvements. Push back if something won't work.",
        "commit": "Finalize your commitment. What exactly will you deliver, and by when? Keep it to 1-2 concrete action items.",
    }

    system_prompt = f"""You are {info['name']}, an AI agent in a team. Your personality:

{soul}

You are in a TASK ROUNDTABLE — a structured work session to plan how to tackle a real project.
This is not casual chat. You are here to contribute your expertise and commit to deliverables.
Keep responses SHORT (2-3 sentences max). Be specific. Reference the actual task details.
Use @mentions when addressing teammates."""

    chat_history = ""
    if isinstance(conversation, list) and conversation:
        chat_history = "\n".join([f"{m['agent']}: {m['text']}" for m in conversation])

    user_msg = f"""TASK:
{task_content[:1500]}

{'DISCUSSION SO FAR:' + chr(10) + chat_history if chat_history else '(You are starting the discussion.)'}

PHASE: {phase.upper()}
{phase_instruction.get(phase, '')}

Respond as {info['name']} — stay in character, be specific about this task."""

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_msg}
    ]

    return call_llm(messages)


def run_roundtable(task_file=None):
    """Run a structured multi-agent roundtable on a real task."""
    task_content, filename = pick_task(task_file)
    if not task_content:
        print("❌ No tasks found in /tasks/in-progress/")
        return

    agents = extract_agents(task_content)
    if len(agents) < 2:
        # Add some relevant agents
        agents.extend(random.sample(['jarvis', 'friday', 'nova'], min(2, 3 - len(agents))))

    agent_names = [AGENT_LOOKUP[a]["name"] for a in agents]
    title = filename.replace('.md', '').replace('-', ' ').title() if filename else "Unknown Task"

    print(f"╔══════════════════════════════════════════╗")
    print(f"║  🏛️  ROUNDTABLE: {title[:35]:<35} ║")
    print(f"║  👥 {', '.join(agent_names):<39} ║")
    print(f"╚══════════════════════════════════════════╝")

    conversation = []
    # Structured phases: understand → propose → refine → commit
    phases = ["understand", "propose", "refine", "commit"]

    for phase in phases:
        print(f"\n📋 Phase: {phase.upper()}")
        # Each agent speaks once per relevant phase
        # Not all agents speak in every phase
        if phase == "understand":
            speakers = agents[:3]  # First few agents set the stage
        elif phase == "propose":
            speakers = agents  # Everyone proposes
        elif phase == "refine":
            speakers = agents[1:3] if len(agents) > 2 else agents  # Key contributors refine
        else:  # commit
            speakers = agents[:3]  # Leads commit

        for agent_key in speakers:
            info = AGENT_LOOKUP[agent_key]
            print(f"  → {info['name']} ({phase})...", end=" ", flush=True)

            response = agent_respond(agent_key, task_content, conversation, phase)

            if response:
                # Clean self-references
                for name in agent_names:
                    if response.startswith(f"{name}: "):
                        response = response[len(f"{name}: "):]
                if response.startswith('"') and response.endswith('"'):
                    response = response[1:-1]

                conversation.append({
                    "agent": info["name"],
                    "text": response,
                    "phase": phase,
                })
                print("✓")
            else:
                print("✗")

    if not conversation:
        print("❌ No messages generated")
        return

    # ─── Save to memory/roundtables/ ────────────────────
    os.makedirs(ROUNDTABLES_DIR, exist_ok=True)
    now = datetime.now()
    rt_filename = f"{now.strftime('%Y-%m-%d-%H%M')}-{filename.replace('.md','')[:30]}.md" if filename else f"{now.strftime('%Y-%m-%d-%H%M')}-roundtable.md"
    rt_path = os.path.join(ROUNDTABLES_DIR, rt_filename)

    md_lines = [
        f"# Roundtable: {title}",
        f"**Date:** {now.strftime('%Y-%m-%d %H:%M')}",
        f"**Format:** Task collaboration — structured problem-solving",
        f"**Participants:** {', '.join([AGENT_LOOKUP[a]['avatar'] + ' ' + AGENT_LOOKUP[a]['name'] for a in agents])}",
        f"**Task File:** `{filename}`",
        "",
        "---",
        "",
    ]

    current_phase = None
    for msg in conversation:
        if msg.get("phase") != current_phase:
            current_phase = msg["phase"]
            md_lines.append(f"### Phase: {current_phase.title()}")
            md_lines.append("")
        avatar = AGENT_LOOKUP.get(msg['agent'].lower(), {}).get('avatar', '🤖')
        # Find avatar by name
        for k, v in AGENT_LOOKUP.items():
            if v['name'] == msg['agent']:
                avatar = v['avatar']
                break
        md_lines.append(f"**{avatar} {msg['agent']}:** {msg['text']}")
        md_lines.append("")

    with open(rt_path, 'w') as f:
        f.write("\n".join(md_lines))
    print(f"\n📄 Saved roundtable: {rt_path}")

    # ─── Also push to banter.json for dashboard ─────────
    ts = now.strftime("%H:%M:%S")
    formatted = []
    for i, msg in enumerate(conversation):
        avatar = "🤖"
        for k, v in AGENT_LOOKUP.items():
            if v['name'] == msg['agent']:
                avatar = v['avatar']
                break
        formatted.append({
            "agent": msg["agent"],
            "avatar": avatar,
            "color": "bg-blue-500",
            "text": msg["text"],
            "turn": i + 1,
            "timestamp": ts,
        })

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
        json.dump({"messages": all_msgs, "last_updated": now.isoformat()}, f, indent=2)

    print(f"💬 Pushed {len(formatted)} messages to dashboard")

    # ─── Print summary ──────────────────────────────────
    print(f"\n{'='*50}")
    print(f"📋 ROUNDTABLE SUMMARY")
    print(f"{'='*50}")
    for msg in conversation:
        avatar = "🤖"
        for k, v in AGENT_LOOKUP.items():
            if v['name'] == msg['agent']:
                avatar = v['avatar']
                break
        phase_tag = f"[{msg.get('phase','').upper()}]" if msg.get('phase') else ""
        print(f"  {avatar} {msg['agent']} {phase_tag}: {msg['text']}")
    print()



def load_state():
    """Load roundtable tracking state."""
    try:
        if os.path.exists(STATE_FILE):
            with open(STATE_FILE, 'r') as f:
                return json.load(f)
    except Exception:
        pass
    return {"discussed": {}}


def save_state(state):
    """Save roundtable tracking state."""
    os.makedirs(os.path.dirname(STATE_FILE), exist_ok=True)
    with open(STATE_FILE, 'w') as f:
        json.dump(state, f, indent=2)


def get_task_hash(filepath):
    """Get content hash of a task file to detect changes."""
    try:
        with open(filepath, 'r') as f:
            return hashlib.md5(f.read().encode()).hexdigest()
    except Exception:
        return None


def find_undiscussed_tasks():
    """Find tasks that are new or have changed since last roundtable."""
    state = load_state()
    discussed = state.get("discussed", {})
    needs_discussion = []

    try:
        for fn in os.listdir(TASKS_DIR):
            if not fn.endswith('.md'):
                continue
            filepath = os.path.join(TASKS_DIR, fn)
            current_hash = get_task_hash(filepath)
            if current_hash and discussed.get(fn) != current_hash:
                needs_discussion.append(fn)
    except Exception:
        pass

    return needs_discussion


def mark_discussed(filename):
    """Mark a task as discussed with its current content hash."""
    state = load_state()
    filepath = os.path.join(TASKS_DIR, filename)
    current_hash = get_task_hash(filepath)
    if current_hash:
        state["discussed"][filename] = current_hash
        state["last_roundtable"] = datetime.now().isoformat()
        save_state(state)


def auto_roundtable():
    """Auto-detect new/changed tasks and run roundtables on them."""
    undiscussed = find_undiscussed_tasks()

    if not undiscussed:
        print("✓ All tasks have been discussed. No roundtable needed.")
        return

    print(f"📋 Found {len(undiscussed)} task(s) needing discussion:")
    for t in undiscussed:
        print(f"   • {t}")

    # Run 1 roundtable per auto-run (keeps costs low)
    task_file = undiscussed[0]
    print(f"\n🏛️ Starting roundtable for: {task_file}")
    run_roundtable(task_file)
    mark_discussed(task_file)
    print(f"✅ Marked as discussed: {task_file}")

    remaining = len(undiscussed) - 1
    if remaining > 0:
        print(f"📋 {remaining} more task(s) will be discussed in the next run.")


if __name__ == "__main__":
    if "--auto" in sys.argv:
        auto_roundtable()
    elif "--task" in sys.argv:
        idx = sys.argv.index("--task")
        task_file = sys.argv[idx + 1] if idx + 1 < len(sys.argv) else None
        run_roundtable(task_file)
    else:
        run_roundtable()
