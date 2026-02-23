/**
 * Orcha client wrapper for ergonomic usage in the TUI
 *
 * This wrapper unwraps async generators and Result types from the
 * synapse-cc generated client, providing a cleaner Promise-based API.
 *
 * See: /workspace/hypermemetic/synapse-cc/docs/client-ergonomics.md
 */

import { createClient, Orcha } from './generated/index.js';
import type {
  SessionInfo,
  AgentInfo,
  AgentSummary,
  CreateSessionRequest,
  CreateSessionResult,
  SpawnAgentRequest,
  ListAgentsRequest,
  ListAgentsResult,
  CheckStatusRequest,
  CheckStatusResult,
  ListSessionsResult,
  GetSessionResult,
} from './generated/orcha/types.js';

export interface OrchaClientWrapper {
  createSession(params: CreateSessionRequest): Promise<SessionInfo>;
  listSessions(): Promise<SessionInfo[]>;
  getSession(sessionId: string): Promise<SessionInfo>;
  spawnAgent(params: SpawnAgentRequest): Promise<{ agentId: string; claudecodeSessionId: string }>;
  listAgents(params: ListAgentsRequest): Promise<AgentInfo[]>;
  checkStatus(params: CheckStatusRequest): Promise<AgentSummary[]>;
  disconnect(): void;
}

export async function createOrchaClient(
  url: string = 'ws://127.0.0.1:4444'
): Promise<OrchaClientWrapper> {
  // Create the base RPC client
  const rpcClient = createClient({
    backend: 'substrate',
    url,
    debug: false,
  });

  // Connect
  await rpcClient.connect();

  // Wrap with typed Orcha client
  const orcha = new Orcha.OrchaClientImpl(rpcClient);

  // Return ergonomic wrapper
  return {
    async createSession(params: CreateSessionRequest): Promise<SessionInfo> {
      // The generated client returns AsyncGenerator<CreateSessionResult>
      for await (const result of orcha.createSession(params)) {
        if (result.type === 'err') {
          throw new Error(result.message);
        }
        if (result.type === 'ok') {
          // Return a minimal SessionInfo with the created session data
          return {
            sessionId: result.sessionId,
            createdAt: result.createdAt,
            lastActivity: result.createdAt,
            model: params.model,
            maxRetries: params.maxRetries || 3,
            retryCount: 0,
            state: undefined as never,
            agentMode: params.multiAgent ? 'multi' : 'single',
            primaryAgentId: null,
          };
        }
      }
      throw new Error('No result returned from generator');
    },

    async listSessions(): Promise<SessionInfo[]> {
      // listSessions returns Promise<ListSessionsResult>, not AsyncGenerator
      const result = await orcha.listSessions();
      if (result.type === 'ok') {
        return result.sessions;
      }
      throw new Error('Unexpected result type');
    },

    async getSession(sessionId: string): Promise<SessionInfo> {
      for await (const result of orcha.getSession({ sessionId })) {
        if (result.type === 'err') {
          throw new Error(result.message);
        }
        if (result.type === 'ok') {
          return result.session;
        }
      }
      throw new Error('No result returned from generator');
    },

    async spawnAgent(params: SpawnAgentRequest): Promise<{ agentId: string; claudecodeSessionId: string }> {
      for await (const result of orcha.spawnAgent(params)) {
        if (result.type === 'err') {
          throw new Error(result.message);
        }
        if (result.type === 'ok') {
          return { agentId: result.agentId, claudecodeSessionId: result.claudecodeSessionId };
        }
      }
      throw new Error('No result returned from generator');
    },

    async listAgents(params: ListAgentsRequest): Promise<AgentInfo[]> {
      for await (const result of orcha.listAgents(params)) {
        if (result.type === 'err') {
          throw new Error(result.message);
        }
        if (result.type === 'ok') {
          return result.agents;
        }
      }
      throw new Error('No result returned from generator');
    },

    async checkStatus(params: CheckStatusRequest): Promise<AgentSummary[]> {
      for await (const result of orcha.checkStatus(params)) {
        if (result.type === 'err') {
          throw new Error(result.message);
        }
        if (result.type === 'ok') {
          return result.agentSummaries;
        }
      }
      throw new Error('No result returned from generator');
    },

    disconnect() {
      rpcClient.disconnect();
    },
  };
}

export type { SessionInfo, AgentInfo, AgentSummary };
