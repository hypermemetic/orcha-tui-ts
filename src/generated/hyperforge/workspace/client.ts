// Auto-generated typed client (Layer 2)
// Wraps RPC layer and unwraps PlexusStreamItem to domain types

import type { RpcClient } from '../../rpc';
import { extractData, collectOne } from '../../rpc';
import type { HyperforgeEvent } from '../../hyperforge/types';

/** Typed client interface for hyperforge.workspace plugin */
export interface HyperforgeWorkspaceClient {
  /** Analyze workspace dependency graph and detect version mismatches */
  analyze(path: string, format?: string | null): AsyncGenerator<HyperforgeEvent>;
  /** Bump versions for workspace packages */
  bump(path: string, bump?: string | null, commit?: boolean | null, dryRun?: boolean | null, filter?: string | null): AsyncGenerator<HyperforgeEvent>;
  /** Check all repos are on expected branch and clean */
  check(path: string, branch?: string | null): AsyncGenerator<HyperforgeEvent>;
  /** Clone all repos for an org from LocalForge into a workspace directory */
  clone(org: string, path: string, concurrency?: number | null, filter?: string | null, forge?: string | null): AsyncGenerator<HyperforgeEvent>;
  /** Compute sync diff between local and a remote forge */
  diff(forge?: string | null, org?: string | null, path?: string | null): AsyncGenerator<HyperforgeEvent>;
  /** Discover repos in a workspace directory */
  discover(path: string): AsyncGenerator<HyperforgeEvent>;
  /** Run a command across all workspace repos */
  exec(command: string, path: string, dirty?: boolean | null, filter?: string | null, sequential?: boolean | null): AsyncGenerator<HyperforgeEvent>;
  /** Initialize unconfigured repos in a workspace */
  init(path: string, dryRun?: boolean | null, force?: boolean | null, forges?: unknown[] | null, noHooks?: boolean | null, noSshWrapper?: boolean | null, org?: string | null): AsyncGenerator<HyperforgeEvent>;
  /** Compare local package versions against their registries */
  packageDiff(path: string, filter?: string | null): AsyncGenerator<HyperforgeEvent>;
  /** Publish packages with transitive dependency resolution */
  publish(path: string, bump?: string | null, execute?: boolean | null, filter?: string | null, noCommit?: boolean | null, noTag?: boolean | null): AsyncGenerator<HyperforgeEvent>;
  /** Push all repos to their configured forges */
  pushAll(path: string, branch?: string | null, dryRun?: boolean | null, setUpstream?: boolean | null, validate?: boolean | null): AsyncGenerator<HyperforgeEvent>;
  /** Get plugin or method schema. Pass {"method": "name"} for a specific method. */
  schema(): Promise<unknown>;
  /** Set default branch on all repos in a workspace */
  setDefaultBranch(branch: string, path: string, checkout?: boolean | null, dryRun?: boolean | null): AsyncGenerator<HyperforgeEvent>;
  /** Full safe sync pipeline: discover → init → register → import → diff → apply (no deletes) → push */
  sync(path: string, dryRun?: boolean | null, forges?: unknown[] | null, noInit?: boolean | null, noPush?: boolean | null, org?: string | null, purge?: boolean | null, reflect?: boolean | null, validate?: boolean | null): AsyncGenerator<HyperforgeEvent>;
  /** Generate/update native workspace manifests (Cargo.toml, cabal.project) */
  unify(path: string, dryRun?: boolean | null): AsyncGenerator<HyperforgeEvent>;
  /** Validate workspace builds in Docker containers */
  validate(path: string, dryRun?: boolean | null, image?: string | null, test?: boolean | null): AsyncGenerator<HyperforgeEvent>;
  /** Verify workspace sync state */
  verify(org?: string | null, path?: string | null): AsyncGenerator<HyperforgeEvent>;
}

/** Typed client implementation for hyperforge.workspace plugin */
export class HyperforgeWorkspaceClientImpl implements HyperforgeWorkspaceClient {
  constructor(private readonly rpc: RpcClient) {}

  /** Analyze workspace dependency graph and detect version mismatches */
  async *analyze(path: string, format?: string | null): AsyncGenerator<HyperforgeEvent> {
    const stream = this.rpc.call('hyperforge.workspace.analyze', { format: format, path: path });
    yield* extractData<HyperforgeEvent>(stream);
  }

  /** Bump versions for workspace packages */
  async *bump(path: string, bump?: string | null, commit?: boolean | null, dryRun?: boolean | null, filter?: string | null): AsyncGenerator<HyperforgeEvent> {
    const stream = this.rpc.call('hyperforge.workspace.bump', { bump: bump, commit: commit, dry_run: dryRun, filter: filter, path: path });
    yield* extractData<HyperforgeEvent>(stream);
  }

  /** Check all repos are on expected branch and clean */
  async *check(path: string, branch?: string | null): AsyncGenerator<HyperforgeEvent> {
    const stream = this.rpc.call('hyperforge.workspace.check', { branch: branch, path: path });
    yield* extractData<HyperforgeEvent>(stream);
  }

  /** Clone all repos for an org from LocalForge into a workspace directory */
  async *clone(org: string, path: string, concurrency?: number | null, filter?: string | null, forge?: string | null): AsyncGenerator<HyperforgeEvent> {
    const stream = this.rpc.call('hyperforge.workspace.clone', { concurrency: concurrency, filter: filter, forge: forge, org: org, path: path });
    yield* extractData<HyperforgeEvent>(stream);
  }

  /** Compute sync diff between local and a remote forge */
  async *diff(forge?: string | null, org?: string | null, path?: string | null): AsyncGenerator<HyperforgeEvent> {
    const stream = this.rpc.call('hyperforge.workspace.diff', { forge: forge, org: org, path: path });
    yield* extractData<HyperforgeEvent>(stream);
  }

  /** Discover repos in a workspace directory */
  async *discover(path: string): AsyncGenerator<HyperforgeEvent> {
    const stream = this.rpc.call('hyperforge.workspace.discover', { path: path });
    yield* extractData<HyperforgeEvent>(stream);
  }

  /** Run a command across all workspace repos */
  async *exec(command: string, path: string, dirty?: boolean | null, filter?: string | null, sequential?: boolean | null): AsyncGenerator<HyperforgeEvent> {
    const stream = this.rpc.call('hyperforge.workspace.exec', { command: command, dirty: dirty, filter: filter, path: path, sequential: sequential });
    yield* extractData<HyperforgeEvent>(stream);
  }

  /** Initialize unconfigured repos in a workspace */
  async *init(path: string, dryRun?: boolean | null, force?: boolean | null, forges?: unknown[] | null, noHooks?: boolean | null, noSshWrapper?: boolean | null, org?: string | null): AsyncGenerator<HyperforgeEvent> {
    const stream = this.rpc.call('hyperforge.workspace.init', { dry_run: dryRun, force: force, forges: forges, no_hooks: noHooks, no_ssh_wrapper: noSshWrapper, org: org, path: path });
    yield* extractData<HyperforgeEvent>(stream);
  }

  /** Compare local package versions against their registries */
  async *packageDiff(path: string, filter?: string | null): AsyncGenerator<HyperforgeEvent> {
    const stream = this.rpc.call('hyperforge.workspace.package_diff', { filter: filter, path: path });
    yield* extractData<HyperforgeEvent>(stream);
  }

  /** Publish packages with transitive dependency resolution */
  async *publish(path: string, bump?: string | null, execute?: boolean | null, filter?: string | null, noCommit?: boolean | null, noTag?: boolean | null): AsyncGenerator<HyperforgeEvent> {
    const stream = this.rpc.call('hyperforge.workspace.publish', { bump: bump, execute: execute, filter: filter, no_commit: noCommit, no_tag: noTag, path: path });
    yield* extractData<HyperforgeEvent>(stream);
  }

  /** Push all repos to their configured forges */
  async *pushAll(path: string, branch?: string | null, dryRun?: boolean | null, setUpstream?: boolean | null, validate?: boolean | null): AsyncGenerator<HyperforgeEvent> {
    const stream = this.rpc.call('hyperforge.workspace.push_all', { branch: branch, dry_run: dryRun, path: path, set_upstream: setUpstream, validate: validate });
    yield* extractData<HyperforgeEvent>(stream);
  }

  /** Get plugin or method schema. Pass {"method": "name"} for a specific method. */
  async schema(): Promise<unknown> {
    const stream = this.rpc.call('hyperforge.workspace.schema', {});
    return collectOne<unknown>(stream);
  }

  /** Set default branch on all repos in a workspace */
  async *setDefaultBranch(branch: string, path: string, checkout?: boolean | null, dryRun?: boolean | null): AsyncGenerator<HyperforgeEvent> {
    const stream = this.rpc.call('hyperforge.workspace.set_default_branch', { branch: branch, checkout: checkout, dry_run: dryRun, path: path });
    yield* extractData<HyperforgeEvent>(stream);
  }

  /** Full safe sync pipeline: discover → init → register → import → diff → apply (no deletes) → push */
  async *sync(path: string, dryRun?: boolean | null, forges?: unknown[] | null, noInit?: boolean | null, noPush?: boolean | null, org?: string | null, purge?: boolean | null, reflect?: boolean | null, validate?: boolean | null): AsyncGenerator<HyperforgeEvent> {
    const stream = this.rpc.call('hyperforge.workspace.sync', { dry_run: dryRun, forges: forges, no_init: noInit, no_push: noPush, org: org, path: path, purge: purge, reflect: reflect, validate: validate });
    yield* extractData<HyperforgeEvent>(stream);
  }

  /** Generate/update native workspace manifests (Cargo.toml, cabal.project) */
  async *unify(path: string, dryRun?: boolean | null): AsyncGenerator<HyperforgeEvent> {
    const stream = this.rpc.call('hyperforge.workspace.unify', { dry_run: dryRun, path: path });
    yield* extractData<HyperforgeEvent>(stream);
  }

  /** Validate workspace builds in Docker containers */
  async *validate(path: string, dryRun?: boolean | null, image?: string | null, test?: boolean | null): AsyncGenerator<HyperforgeEvent> {
    const stream = this.rpc.call('hyperforge.workspace.validate', { dry_run: dryRun, image: image, path: path, test: test });
    yield* extractData<HyperforgeEvent>(stream);
  }

  /** Verify workspace sync state */
  async *verify(org?: string | null, path?: string | null): AsyncGenerator<HyperforgeEvent> {
    const stream = this.rpc.call('hyperforge.workspace.verify', { org: org, path: path });
    yield* extractData<HyperforgeEvent>(stream);
  }

}

/** Create a typed hyperforge.workspace client from an RPC client */
export function createHyperforgeWorkspaceClient(rpc: RpcClient): HyperforgeWorkspaceClient {
  return new HyperforgeWorkspaceClientImpl(rpc);
}