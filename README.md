# Nexus Dashboard - Personal Command Center

Your personal AI agent monitoring and control dashboard.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Authentication

Generate a password hash for your dashboard:

```bash
node scripts/generate-password-hash.js
```

This will prompt you for a password and output a bcrypt hash.

### 3. Configure Environment

Create or update `.env.local`:

```bash
# Nexus Password Authentication
NEXUS_PASSWORD_HASH=<your-hash-from-step-2>

# Session secret (generate with: openssl rand -base64 32)
SESSION_SECRET=<your-random-secret>
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## 🔐 Authentication

The dashboard uses simple password-based authentication:
- Password is verified against a bcrypt hash stored in `.env.local`
- Session is maintained via HTTP-only cookies
- **Never commit `.env.local` to version control**

## 🎯 Features

- **Project Board** - Monitor tasks across your agent squad
- **3D Isometric Agent Grid** - Visualize agent positions and activity
- **Global Search** - Search across agent memories and tasks
- **Agent Recruitment** - Add new agents to your squad
- **Environment Themes** - Switch between Fortress, Office, and Lab aesthetics

## 🏗️ Project Structure

```
src/
├── app/
│   ├── page.tsx              # Main dashboard
│   ├── mission-control/      # Alternative dashboard view
│   └── api/auth/             # Authentication endpoints
└── components/
    ├── SimpleLogin.tsx       # Login component
    ├── ProjectBoard.tsx      # Task visualization
    ├── IsometricScene.tsx    # 3D agent grid
    └── GlobalSearch.tsx      # Search interface
```

## 🔧 Configuration

### Localhost-Only Access

The dashboard is configured for local-only access by default. To access from other devices on your network, you can:

1. Find your local IP: `ifconfig | grep "inet "`
2. Access via: `http://your-local-ip:3000`

### Permanent Local Address

For a permanent local address (e.g., `nexus.local`), configure mDNS/Bonjour on your Mac:

```bash
# Your Mac should already broadcast as: <hostname>.local
# Access the dashboard at: http://<your-mac-hostname>.local:3000
```

## 🛡️ Security

- Passwords are hashed using bcrypt (10 rounds)
- Session cookies are HTTP-only and secure
- No external authentication dependencies
- Designed for single-user, local-network usage

## 📝 License

This is a personal project for managing your AI agent infrastructure.
