# Orcha TUI (TypeScript)

Terminal user interface for Orcha multi-agent orchestration, built with TypeScript, Ink, and the synapse-cc generated client.

## Overview

This TUI provides a command-line interface to:
- List and create Orcha sessions
- Spawn and monitor agents within sessions
- Check real-time status of running agents
- View AI-generated summaries of agent progress

## Architecture

```
orcha-tui-ts/
├── package.json           # Ink, React dependencies
├── tsconfig.json          # TypeScript config
└── src/
    ├── cli.tsx            # CLI entry point
    ├── App.tsx            # Main UI component (Ink/React)
    └── orchaClient.ts     # Wrapper around generated client
```

## How It Works

### Generated Client Integration

This TUI uses the **synapse-cc generated TypeScript client** which is copied into `src/generated/`. The generated client provides full type safety for all Orcha RPC methods.

```typescript
import { createClient, Orcha } from './generated/index.js';
```

### Ergonomic Wrapper

To avoid the async generator + Result type boilerplate documented in [client-ergonomics.md](../synapse-cc/docs/client-ergonomics.md), we provide a wrapper in `src/orchaClient.ts`:

```typescript
// Instead of this (10 lines):
for await (const result of orcha.createSession({ ... })) {
  if ('Ok' in result) {
    console.log(result.Ok)
    break
  } else if ('Err' in result) {
    throw new Error(result.Err.message)
  }
}

// We can write this (1 line):
const session = await client.createSession({ ... })
```

The wrapper uses a generic `unwrapResult()` helper that:
1. Consumes the async generator
2. Unwraps the `Ok | Err` discriminated union
3. Throws on error, returns the value on success

## Installation

```bash
cd /workspace/hypermemetic/orcha-tui-ts
npm install
```

## Usage

### Development Mode

```bash
npm run dev
```

This uses `tsx` to run the TypeScript directly without compiling.

### Production Build

```bash
npm run build
npm start
```

### Custom Backend URL

```bash
npm run dev -- --url=ws://localhost:4444
```

## Keyboard Shortcuts

### Sessions View
- `n` - Create new session
- `r` - Refresh session list
- `Enter` - Select session (view agents)
- `q` - Quit

### Agents View
- `s` - Spawn new agent
- `c` - Check status (AI summaries)
- `b` - Back to sessions
- `q` - Quit

## Features

### Implemented

- **Session Management**
  - List all Orcha sessions
  - Create new sessions (select model: Sonnet/Opus/Haiku)
  - View session state (running, idle, complete)
  - Auto-refresh every 5 seconds

- **Agent Management**
  - List agents in selected session
  - Spawn new agents with custom subtasks
  - Real-time state indicators (running, idle, complete)
  - Agent subtask display

- **Status Monitoring**
  - AI-generated status summaries
  - Per-agent progress reports
  - Manual refresh via 'c' key

### UI Layout

```
┌─ Orcha TUI - Sessions ───────────────────── [N]ew [R]efresh [Q]uit ─┐
│                                                                       │
│ ┌─ Sessions (2) ───────────────────────────────────────────────────┐│
│ │ ▸ 8f3a2b1d... [sonnet] Multi [running]                           ││
│ │ ▸ 9c5e7a3f... [opus] Single [complete]                           ││
│ └───────────────────────────────────────────────────────────────────┘│
│                                                                       │
│ Press Enter to select a session, or use keyboard shortcuts above     │
└───────────────────────────────────────────────────────────────────────┘
```

```
┌─ Orcha TUI - Session: 8f3a2b1d... ── [B]ack [S]pawn [C]heck [Q]uit ─┐
│                                                                       │
│ ┌─ Agents (3) ─────────────────────────────────────────────────────┐│
│ │ ● a1b2c3d4... [running] Fix authentication bug                   ││
│ │ ○ e5f6g7h8... [complete] Write unit tests                        ││
│ │ ○ i9j0k1l2... [idle] Update documentation                        ││
│ └───────────────────────────────────────────────────────────────────┘│
│                                                                       │
│ ┌─ Status Summary ─────────────────────────────────────────────────┐│
│ │ Agent a1b2c3d4...: Currently implementing JWT token validation   ││
│ │ Agent e5f6g7h8...: Tests complete, all passing                   ││
│ └───────────────────────────────────────────────────────────────────┘│
└───────────────────────────────────────────────────────────────────────┘
```

## Technical Details

### Client Wrapper (`src/orchaClient.ts`)

Provides Promise-based methods:

- `createSession(params)` → `Promise<OrchaSession>`
- `listSessions()` → `Promise<OrchaSession[]>`
- `getSession(sessionId)` → `Promise<OrchaSession>`
- `spawnAgent(params)` → `Promise<void>`
- `listAgents(params)` → `Promise<AgentInfo[]>`
- `checkStatus(params)` → `Promise<AgentSummary[]>`

### App Component (`src/App.tsx`)

React-style component using Ink hooks:

- `useState` - UI state management
- `useEffect` - Data loading and auto-refresh
- `useInput` - Keyboard shortcut handling
- `useApp` - Exit handler

### Ink Components Used

- `Box` - Layout containers
- `Text` - Styled text rendering
- `TextInput` - Text input fields
- `SelectInput` - Selection menus
- `Spinner` - Loading indicators

## Comparison to Rust TUI

See [../orcha-tui/README.md](../orcha-tui/README.md) for the Rust TUI approach.

**TypeScript (this project):**
- ✅ Reuses generated client from Maestro
- ✅ Familiar React/Ink component model
- ⚠️ Requires ergonomic wrapper for generated client
- ⚠️ Network dependency (WebSocket)

**Rust (alternative):**
- ✅ Direct library usage (no codegen, no RPC)
- ✅ Zero boilerplate
- ✅ Better performance (no network overhead)
- ⚠️ Rust learning curve

## Development Notes

### Type Safety

All types are auto-generated from the backend and imported:

```typescript
import type {
  OrchaSession,
  AgentInfo,
  AgentSummary,
  CreateSessionRequest,
  SpawnAgentRequest,
  ListAgentsRequest,
  CheckStatusRequest,
} from '../../orcha-maestro/src/generated/orcha/types.js';
```

This means:
- Full IntelliSense in VS Code
- Compile-time type checking
- Zero manual type maintenance

### Error Handling

Errors are displayed in the UI:

```typescript
if (error) {
  return (
    <Box flexDirection="column">
      <Text color="red">Error: {error}</Text>
      <Text dimColor>Press q to quit</Text>
    </Box>
  );
}
```

### Auto-Refresh

The TUI auto-refreshes data every 5 seconds:

```typescript
useEffect(() => {
  const interval = setInterval(() => {
    if (view === 'sessions') {
      loadSessions();
    } else if (view === 'agents' && selectedSessionId) {
      loadAgents(selectedSessionId);
    }
  }, 5000);

  return () => clearInterval(interval);
}, [client, view, selectedSessionId]);
```

## Dependencies

- **ink** - React for CLI (terminal rendering)
- **ink-text-input** - Text input component
- **ink-spinner** - Loading spinners
- **ink-select-input** - Selection menus
- **react** - React runtime (required by Ink)
- **tsx** - TypeScript execution for development

## Related Projects

- [orcha-maestro](../orcha-maestro/) - Vue web UI (source of generated client)
- [orcha-tui](../orcha-tui/) - Rust TUI documentation
- [plexus-substrate](../plexus-substrate/) - Backend substrate server
- [synapse-cc](../synapse-cc/) - Code generator toolchain

## See Also

- [Client Ergonomics Guide](../synapse-cc/docs/client-ergonomics.md) - DX analysis
- [Ink Documentation](https://github.com/vadimdemedes/ink) - React for CLI
- [synapse-cc TypeScript Generator](../hub-codegen/src/generator/typescript/)
