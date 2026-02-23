// Auto-generated typed client (Layer 2)
// Wraps RPC layer and unwraps PlexusStreamItem to domain types

import type { RpcClient } from '../rpc';
import { extractData, collectOne } from '../rpc';
import type { ConfirmEvent, DeleteEvent, WizardEvent } from './types';

/** Typed client interface for interactive plugin */
export interface InteractiveClient {
  /** Simple confirmation method for testing  Just asks a yes/no question and returns the result. */
  confirm(message: string): Promise<ConfirmEvent>;
  /** Delete files with confirmation  Demonstrates confirmation before destructive operations. */
  delete(paths: string[]): Promise<DeleteEvent>;
  /** Get plugin or method schema. Pass {"method": "name"} for a specific method. */
  schema(): Promise<unknown>;
  /** Multi-step setup wizard demonstrating all bidirectional patterns  This method demonstrates: - Text prompts (ctx.prompt) - Selection menus (ctx.select) - Confirmations (ctx.confirm) - Graceful error handling */
  wizard(): Promise<WizardEvent>;
}

/** Typed client implementation for interactive plugin */
export class InteractiveClientImpl implements InteractiveClient {
  constructor(private readonly rpc: RpcClient) {}

  /** Simple confirmation method for testing  Just asks a yes/no question and returns the result. */
  async confirm(message: string): Promise<ConfirmEvent> {
    const stream = this.rpc.call('interactive.confirm', { message: message });
    return collectOne<ConfirmEvent>(stream);
  }

  /** Delete files with confirmation  Demonstrates confirmation before destructive operations. */
  async delete(paths: string[]): Promise<DeleteEvent> {
    const stream = this.rpc.call('interactive.delete', { paths: paths });
    return collectOne<DeleteEvent>(stream);
  }

  /** Get plugin or method schema. Pass {"method": "name"} for a specific method. */
  async schema(): Promise<unknown> {
    const stream = this.rpc.call('interactive.schema', {});
    return collectOne<unknown>(stream);
  }

  /** Multi-step setup wizard demonstrating all bidirectional patterns  This method demonstrates: - Text prompts (ctx.prompt) - Selection menus (ctx.select) - Confirmations (ctx.confirm) - Graceful error handling */
  async wizard(): Promise<WizardEvent> {
    const stream = this.rpc.call('interactive.wizard', {});
    return collectOne<WizardEvent>(stream);
  }

}

/** Create a typed interactive client from an RPC client */
export function createInteractiveClient(rpc: RpcClient): InteractiveClient {
  return new InteractiveClientImpl(rpc);
}