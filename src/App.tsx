import React, { useState, useEffect } from 'react';
import { Box, Text, useInput, useApp } from 'ink';
import Spinner from 'ink-spinner';
import TextInput from 'ink-text-input';
import SelectInput from 'ink-select-input';
import {
  createOrchaClient,
  type OrchaClientWrapper,
  type SessionInfo,
  type AgentInfo,
  type AgentSummary,
} from './orchaClient.js';

type View = 'sessions' | 'agents' | 'create-session' | 'spawn-agent';

interface AppProps {
  url?: string;
}

export default function App({ url = 'ws://127.0.0.1:4444' }: AppProps) {
  const { exit } = useApp();
  const [client, setClient] = useState<OrchaClientWrapper | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Data state
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [agents, setAgents] = useState<AgentInfo[]>([]);
  const [statusSummaries, setStatusSummaries] = useState<AgentSummary[]>([]);

  // UI state
  const [view, setView] = useState<View>('sessions');
  const [newSessionModel, setNewSessionModel] = useState<'sonnet' | 'opus' | 'haiku'>('sonnet');
  const [newSessionMultiAgent, setNewSessionMultiAgent] = useState(true);
  const [spawnAgentSubtask, setSpawnAgentSubtask] = useState('');

  // Initialize client
  useEffect(() => {
    let mounted = true;

    createOrchaClient(url)
      .then((c) => {
        if (mounted) {
          setClient(c);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (mounted) {
          setError(e.message);
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [url]);

  // Load sessions on mount
  useEffect(() => {
    if (client) {
      loadSessions();
    }
  }, [client]);

  // Auto-refresh every 5 seconds
  useEffect(() => {
    if (!client || view === 'create-session' || view === 'spawn-agent') return;

    const interval = setInterval(() => {
      if (view === 'sessions') {
        loadSessions();
      } else if (view === 'agents' && selectedSessionId) {
        loadAgents(selectedSessionId);
        loadStatus(selectedSessionId);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [client, view, selectedSessionId]);

  // Keyboard shortcuts
  useInput((input, key) => {
    if (input === 'q' || (key.ctrl && input === 'c')) {
      client?.disconnect();
      exit();
    }

    if (view === 'sessions') {
      if (input === 'r') {
        loadSessions();
      } else if (input === 'n') {
        setView('create-session');
      } else if (key.return && sessions.length > 0) {
        // Select first session for demo
        setSelectedSessionId(sessions[0].sessionId);
        setView('agents');
      }
    } else if (view === 'agents') {
      if (input === 'b') {
        setView('sessions');
      } else if (input === 's') {
        setView('spawn-agent');
      } else if (input === 'c') {
        if (selectedSessionId) {
          loadStatus(selectedSessionId);
        }
      }
    }
  });

  async function loadSessions() {
    if (!client) return;
    try {
      const sessionList = await client.listSessions();
      setSessions(sessionList);
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function loadAgents(sessionId: string) {
    if (!client) return;
    try {
      const agentList = await client.listAgents({ sessionId });
      setAgents(agentList);
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function loadStatus(sessionId: string) {
    if (!client) return;
    try {
      const summaries = await client.checkStatus({ sessionId });
      setStatusSummaries(summaries);
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function handleCreateSession() {
    if (!client) return;
    try {
      const session = await client.createSession({
        model: newSessionModel,
        multiAgent: newSessionMultiAgent,
        workingDirectory: '/workspace',
        maxRetries: 3,
      });
      console.log('Created session:', session.sessionId);
      await loadSessions();
      setView('sessions');
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function handleSpawnAgent() {
    if (!client || !selectedSessionId || !spawnAgentSubtask.trim()) return;
    try {
      await client.spawnAgent({
        sessionId: selectedSessionId,
        subtask: spawnAgentSubtask,
        parentAgentId: null,
      });
      await loadAgents(selectedSessionId);
      setSpawnAgentSubtask('');
      setView('agents');
    } catch (e: any) {
      setError(e.message);
    }
  }

  if (loading) {
    return (
      <Box>
        <Text>
          <Spinner type="dots" /> Connecting to Orcha...
        </Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box flexDirection="column">
        <Text color="red">Error: {error}</Text>
        <Text dimColor>Press q to quit</Text>
      </Box>
    );
  }

  if (view === 'create-session') {
    return (
      <Box flexDirection="column" padding={1}>
        <Text bold>Create New Session</Text>
        <Box marginTop={1}>
          <Text>Model: </Text>
          <SelectInput
            items={[
              { label: 'Sonnet', value: 'sonnet' },
              { label: 'Opus', value: 'opus' },
              { label: 'Haiku', value: 'haiku' },
            ]}
            onSelect={(item) => {
              setNewSessionModel(item.value as any);
              handleCreateSession();
            }}
          />
        </Box>
      </Box>
    );
  }

  if (view === 'spawn-agent') {
    return (
      <Box flexDirection="column" padding={1}>
        <Text bold>Spawn Agent</Text>
        <Box marginTop={1}>
          <Text>Subtask: </Text>
          <TextInput
            value={spawnAgentSubtask}
            onChange={setSpawnAgentSubtask}
            onSubmit={handleSpawnAgent}
          />
        </Box>
        <Box marginTop={1}>
          <Text dimColor>Press Enter to spawn, Esc to cancel</Text>
        </Box>
      </Box>
    );
  }

  if (view === 'agents') {
    return (
      <Box flexDirection="column" padding={1}>
        <Box>
          <Text bold>Orcha TUI - Session: </Text>
          <Text color="cyan">{selectedSessionId?.slice(0, 8)}...</Text>
          <Text dimColor> [B]ack [S]pawn [C]heck [Q]uit</Text>
        </Box>

        <Box marginTop={1} flexDirection="column" borderStyle="single" borderColor="blue">
          <Text bold> Agents ({agents.length})</Text>
          {agents.length === 0 ? (
            <Text dimColor> No agents yet. Press 's' to spawn one.</Text>
          ) : (
            agents.map((agent) => (
              <Box key={agent.agentId} marginLeft={1}>
                <Text color={agent.state === 'running' ? 'green' : 'gray'}>
                  {agent.state === 'running' ? '●' : '○'}
                </Text>
                <Text> {agent.agentId.slice(0, 8)}... </Text>
                <Text dimColor>[{agent.state}]</Text>
                <Text> {agent.subtask || '(no subtask)'}</Text>
              </Box>
            ))
          )}
        </Box>

        <Box marginTop={1} flexDirection="column" borderStyle="single" borderColor="green">
          <Text bold> Status Summary</Text>
          {statusSummaries.length === 0 ? (
            <Text dimColor> No status yet. Press 'c' to check.</Text>
          ) : (
            statusSummaries.map((summary, i) => (
              <Box key={i} marginLeft={1} flexDirection="column">
                <Text>
                  Agent {summary.agentId.slice(0, 8)}...: {summary.summary}
                </Text>
              </Box>
            ))
          )}
        </Box>
      </Box>
    );
  }

  // Sessions view (default)
  return (
    <Box flexDirection="column" padding={1}>
      <Box>
        <Text bold>Orcha TUI - Sessions</Text>
        <Text dimColor> [N]ew [R]efresh [Q]uit</Text>
      </Box>

      <Box marginTop={1} flexDirection="column" borderStyle="single" borderColor="cyan">
        <Text bold> Sessions ({sessions.length})</Text>
        {sessions.length === 0 ? (
          <Text dimColor> No sessions. Press 'n' to create one.</Text>
        ) : (
          sessions.map((session) => (
            <Box key={session.sessionId} marginLeft={1}>
              <Text color="cyan">▸</Text>
              <Text> {session.sessionId.slice(0, 8)}... </Text>
              <Text dimColor>[{session.model}]</Text>
              <Text> {session.agentMode === 'multi' ? 'Multi' : 'Single'} </Text>
              <Text color="gray">[active]</Text>
            </Box>
          ))
        )}
      </Box>

      <Box marginTop={1}>
        <Text dimColor>Press Enter to select a session, or use keyboard shortcuts above</Text>
      </Box>
    </Box>
  );
}
