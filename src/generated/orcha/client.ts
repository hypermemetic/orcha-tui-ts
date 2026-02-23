// Auto-generated typed client (Layer 2)
// Wraps RPC layer and unwraps PlexusStreamItem to domain types

import type { RpcClient } from '../rpc';
import { extractData, collectOne } from '../rpc';
import type { CheckStatusRequest, CheckStatusResult, CreateSessionRequest, CreateSessionResult, DeleteSessionResult, ExtractValidationResult, GetAgentRequest, GetAgentResult, GetSessionRequest, GetSessionResult, IncrementRetryResult, ListAgentsRequest, ListAgentsResult, ListMonitorTreesResult, ListSessionsResult, OrchaEvent, RunTaskAsyncResult, RunTaskRequest, RunValidationResult, SessionState, SpawnAgentRequest, SpawnAgentResult, UpdateSessionStateResult, ValidationArtifact } from './types';

/** Typed client interface for orcha plugin */
export interface OrchaClient {
  /** Check status of a running session by asking Claude to summarize  Creates an ephemeral forked session to generate a summary of what's happening, and saves the summary to an arbor monitoring tree for historical tracking. */
  checkStatus(request: CheckStatusRequest): AsyncGenerator<CheckStatusResult>;
  /** Create a new orchestration session  Creates a session record to track orchestration state. The client should then create a corresponding claudecode session with loopback enabled. */
  createSession(request: CreateSessionRequest): AsyncGenerator<CreateSessionResult>;
  /** Delete a session */
  deleteSession(sessionId: string): AsyncGenerator<DeleteSessionResult>;
  /** Extract validation artifact from text  Scans text for {"orcha_validate": {...}} pattern and extracts test command */
  extractValidation(text: string): AsyncGenerator<ExtractValidationResult>;
  /** Get specific agent info */
  getAgent(request: GetAgentRequest): AsyncGenerator<GetAgentResult>;
  /** Get session information */
  getSession(request: GetSessionRequest): AsyncGenerator<GetSessionResult>;
  /** Increment retry counter for a session  Called when validation fails and the client wants to retry */
  incrementRetry(sessionId: string): AsyncGenerator<IncrementRetryResult>;
  /** List all agents in a session */
  listAgents(request: ListAgentsRequest): AsyncGenerator<ListAgentsResult>;
  /** List all orcha monitor trees  Returns all arbor trees created by orcha for monitoring sessions */
  listMonitorTrees(): Promise<ListMonitorTreesResult>;
  /** List all sessions */
  listSessions(): Promise<ListSessionsResult>;
  /** Run a complete orchestration task  This is the main entry point for running tasks with the full orcha pattern: - Creates sessions - Runs task with approval handling - Extracts and executes validation - Auto-retries on failure */
  runTask(request: RunTaskRequest): AsyncGenerator<OrchaEvent>;
  /** Run a task asynchronously - returns immediately with session_id  Like run_task but non-blocking. Returns the session_id immediately and the task runs in the background. Use check_status or get_session to check on progress. */
  runTaskAsync(request: RunTaskRequest): AsyncGenerator<RunTaskAsyncResult>;
  /** Run a validation test  Executes a test command and returns the result */
  runValidation(artifact: ValidationArtifact): Promise<RunValidationResult>;
  /** Get plugin or method schema. Pass {"method": "name"} for a specific method. */
  schema(): Promise<unknown>;
  /** Spawn a new agent in an existing session (multi-agent mode)  Creates a new ClaudeCode session and tracks it as an agent within the orcha session. Can be called explicitly via API or by agents themselves requesting helpers. */
  spawnAgent(request: SpawnAgentRequest): AsyncGenerator<SpawnAgentResult>;
  /** Update session state  Called by the client to update the current state of the session */
  updateSessionState(sessionId: string, state: SessionState): AsyncGenerator<UpdateSessionStateResult>;
}

/** Typed client implementation for orcha plugin */
export class OrchaClientImpl implements OrchaClient {
  constructor(private readonly rpc: RpcClient) {}

  /** Check status of a running session by asking Claude to summarize  Creates an ephemeral forked session to generate a summary of what's happening, and saves the summary to an arbor monitoring tree for historical tracking. */
  async *checkStatus(request: CheckStatusRequest): AsyncGenerator<CheckStatusResult> {
    const stream = this.rpc.call('orcha.check_status', { request: request });
    yield* extractData<CheckStatusResult>(stream);
  }

  /** Create a new orchestration session  Creates a session record to track orchestration state. The client should then create a corresponding claudecode session with loopback enabled. */
  async *createSession(request: CreateSessionRequest): AsyncGenerator<CreateSessionResult> {
    const stream = this.rpc.call('orcha.create_session', { request: request });
    yield* extractData<CreateSessionResult>(stream);
  }

  /** Delete a session */
  async *deleteSession(sessionId: string): AsyncGenerator<DeleteSessionResult> {
    const stream = this.rpc.call('orcha.delete_session', { session_id: sessionId });
    yield* extractData<DeleteSessionResult>(stream);
  }

  /** Extract validation artifact from text  Scans text for {"orcha_validate": {...}} pattern and extracts test command */
  async *extractValidation(text: string): AsyncGenerator<ExtractValidationResult> {
    const stream = this.rpc.call('orcha.extract_validation', { text: text });
    yield* extractData<ExtractValidationResult>(stream);
  }

  /** Get specific agent info */
  async *getAgent(request: GetAgentRequest): AsyncGenerator<GetAgentResult> {
    const stream = this.rpc.call('orcha.get_agent', { request: request });
    yield* extractData<GetAgentResult>(stream);
  }

  /** Get session information */
  async *getSession(request: GetSessionRequest): AsyncGenerator<GetSessionResult> {
    const stream = this.rpc.call('orcha.get_session', { request: request });
    yield* extractData<GetSessionResult>(stream);
  }

  /** Increment retry counter for a session  Called when validation fails and the client wants to retry */
  async *incrementRetry(sessionId: string): AsyncGenerator<IncrementRetryResult> {
    const stream = this.rpc.call('orcha.increment_retry', { session_id: sessionId });
    yield* extractData<IncrementRetryResult>(stream);
  }

  /** List all agents in a session */
  async *listAgents(request: ListAgentsRequest): AsyncGenerator<ListAgentsResult> {
    const stream = this.rpc.call('orcha.list_agents', { request: request });
    yield* extractData<ListAgentsResult>(stream);
  }

  /** List all orcha monitor trees  Returns all arbor trees created by orcha for monitoring sessions */
  async listMonitorTrees(): Promise<ListMonitorTreesResult> {
    const stream = this.rpc.call('orcha.list_monitor_trees', {});
    return collectOne<ListMonitorTreesResult>(stream);
  }

  /** List all sessions */
  async listSessions(): Promise<ListSessionsResult> {
    const stream = this.rpc.call('orcha.list_sessions', {});
    return collectOne<ListSessionsResult>(stream);
  }

  /** Run a complete orchestration task  This is the main entry point for running tasks with the full orcha pattern: - Creates sessions - Runs task with approval handling - Extracts and executes validation - Auto-retries on failure */
  async *runTask(request: RunTaskRequest): AsyncGenerator<OrchaEvent> {
    const stream = this.rpc.call('orcha.run_task', { request: request });
    yield* extractData<OrchaEvent>(stream);
  }

  /** Run a task asynchronously - returns immediately with session_id  Like run_task but non-blocking. Returns the session_id immediately and the task runs in the background. Use check_status or get_session to check on progress. */
  async *runTaskAsync(request: RunTaskRequest): AsyncGenerator<RunTaskAsyncResult> {
    const stream = this.rpc.call('orcha.run_task_async', { request: request });
    yield* extractData<RunTaskAsyncResult>(stream);
  }

  /** Run a validation test  Executes a test command and returns the result */
  async runValidation(artifact: ValidationArtifact): Promise<RunValidationResult> {
    const stream = this.rpc.call('orcha.run_validation', { artifact: artifact });
    return collectOne<RunValidationResult>(stream);
  }

  /** Get plugin or method schema. Pass {"method": "name"} for a specific method. */
  async schema(): Promise<unknown> {
    const stream = this.rpc.call('orcha.schema', {});
    return collectOne<unknown>(stream);
  }

  /** Spawn a new agent in an existing session (multi-agent mode)  Creates a new ClaudeCode session and tracks it as an agent within the orcha session. Can be called explicitly via API or by agents themselves requesting helpers. */
  async *spawnAgent(request: SpawnAgentRequest): AsyncGenerator<SpawnAgentResult> {
    const stream = this.rpc.call('orcha.spawn_agent', { request: request });
    yield* extractData<SpawnAgentResult>(stream);
  }

  /** Update session state  Called by the client to update the current state of the session */
  async *updateSessionState(sessionId: string, state: SessionState): AsyncGenerator<UpdateSessionStateResult> {
    const stream = this.rpc.call('orcha.update_session_state', { session_id: sessionId, state: state });
    yield* extractData<UpdateSessionStateResult>(stream);
  }

}

/** Create a typed orcha client from an RPC client */
export function createOrchaClient(rpc: RpcClient): OrchaClient {
  return new OrchaClientImpl(rpc);
}