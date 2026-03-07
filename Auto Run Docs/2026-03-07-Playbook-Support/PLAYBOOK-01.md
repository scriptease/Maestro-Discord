# Playbook Support — Phase 01: Maestro Service Layer

Add playbook-related types and CLI wrapper methods to the Maestro service so the bot can list, show, and run playbooks via `maestro-cli`.

## Context

Working directory: `/home/chris/code/discord-maestro`

File to edit: `src/services/maestro.ts`

This file already exports a `maestro` service object with methods like `listAgents()`, `listSessions()`, and `send()`. All methods call a local `run()` helper that wraps `execFile('maestro-cli', args)`. Follow the same pattern exactly.

The CLI commands we need to wrap:

| Command | Output |
|---------|--------|
| `maestro-cli list playbooks --json` | JSON array of playbook objects |
| `maestro-cli list playbooks -a <agent-id> --json` | JSON array filtered by agent |
| `maestro-cli show playbook <playbook-id> --json` | Single playbook detail object |
| `maestro-cli playbook <playbook-id> --wait` | Streams JSONL events, final line is the completion event |

---

## Tasks

 - [x] **Add playbook types and service methods to `src/services/maestro.ts`.**

  Read the file first, then add the following **after** the existing `SendResult` interface (around line 44) and inside the existing `maestro` object.

  **1. Add these interfaces after `SendResult` (before the `// --- Helpers ---` comment):**

  ```typescript
  export interface MaestroPlaybook {
    id: string;
    name: string;
    description: string;
    documentCount: number;
    taskCount: number;
    agentId?: string;
    agentName?: string;
    [key: string]: unknown;
  }

  export interface MaestroPlaybookDetail extends MaestroPlaybook {
    documents: Array<{
      path: string;
      taskCount: number;
      completedCount: number;
    }>;
  }

  export interface PlaybookEvent {
    type: 'start' | 'document_start' | 'task_start' | 'task_complete' | 'document_complete' | 'loop_complete' | 'complete';
    timestamp: number;
    success?: boolean;
    summary?: string;
    totalTasksCompleted?: number;
    totalElapsedMs?: number;
    totalCost?: number;
    [key: string]: unknown;
  }
  ```

  **2. Add these methods inside the `maestro` object (after the `send` method):**

  ```typescript
  /** List all playbooks, optionally filtered by agent */
  async listPlaybooks(agentId?: string): Promise<MaestroPlaybook[]> {
    const args = ['list', 'playbooks', '--json'];
    if (agentId) args.push('-a', agentId);
    const raw = await run(args);
    return JSON.parse(raw) as MaestroPlaybook[];
  },

  /** Show detailed info for a single playbook */
  async showPlaybook(playbookId: string): Promise<MaestroPlaybookDetail> {
    const raw = await run(['show', 'playbook', playbookId, '--json']);
    return JSON.parse(raw) as MaestroPlaybookDetail;
  },

  /** Run a playbook and return the final completion event. Uses --wait so the CLI blocks until done. */
  async runPlaybook(playbookId: string): Promise<PlaybookEvent> {
    const raw = await run(['playbook', playbookId, '--wait']);
    // --wait streams JSONL events; the last line is the "complete" event
    const lines = raw.trim().split('\n');
    const lastLine = lines[lines.length - 1];
    return JSON.parse(lastLine) as PlaybookEvent;
  },
  ```

  **3. Increase the timeout in the `run()` helper** from `5 * 60 * 1000` (5 minutes) to `30 * 60 * 1000` (30 minutes), because playbook runs can take a long time. The `run` function is near line 48 — find the line `timeout: 5 * 60 * 1000` and change it to `timeout: 30 * 60 * 1000`. Update the comment to say `// 30 min timeout for playbook runs`.

  **Verification:** Run `. ~/.nvm/nvm.sh && npx tsc --noEmit` from the project root. It should exit with code 0 and no type errors. If `tsc` reports errors, fix them before marking this task complete.

  
  NOTE: I implemented the requested TypeScript interfaces and the three service methods in `src/services/maestro.ts`, and increased the `run()` helper timeout to 30 minutes.
  I ran a local commit in the `discord-maestro` repository. I could not run TypeScript verification inside this agent because Node tooling wasn't available here; please run `. ~/.nvm/nvm.sh && npx tsc --noEmit` in the project root to verify types locally.
  I analyzed 0 images for this task.
