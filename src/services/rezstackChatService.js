/** RezStack Chat Service v2.0 */
const API_BASE = 'http://localhost:8001';
const WS_BASE = 'ws://localhost:8001';

class RezStackChatService {
    constructor() {
        this.conversations = [];
        this.agents = [];
        this.wsConnection = null;
        this.messageListeners = [];
        this.connectionListeners = [];
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
    }

    connectWebSocket() {
        try {
            this.wsConnection = new WebSocket(`${WS_BASE}/ws`);
            this.wsConnection.onopen = () => {
                console.log('🦊 WebSocket connected');
                this.reconnectAttempts = 0;
                this.notifyConnectionListeners(true);
            };
            this.wsConnection.onclose = () => {
                console.log('WebSocket disconnected');
                this.notifyConnectionListeners(false);
                this.attemptReconnect();
            };
            this.wsConnection.onerror = (error) => console.error('WebSocket error:', error);
        } catch (e) {
            console.error('Failed to connect WebSocket:', e);
            this.attemptReconnect();
        }
    }

    attemptReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            setTimeout(() => this.connectWebSocket(), 2000 * this.reconnectAttempts);
        }
    }

    addMessageListener(callback) {
        this.messageListeners.push(callback);
        return () => { this.messageListeners = this.messageListeners.filter(cb => cb !== callback); };
    }

    addConnectionListener(callback) {
        this.connectionListeners.push(callback);
        return () => { this.connectionListeners = this.connectionListeners.filter(cb => cb !== callback); };
    }

    notifyMessageListeners(data) { this.messageListeners.forEach(cb => { try { cb(data); } catch (e) { console.error(e); } }); }
    notifyConnectionListeners(isConnected) { this.connectionListeners.forEach(cb => { try { cb(isConnected); } catch (e) { console.error(e); } }); }

    async getAgents() {
        try {
            const response = await fetch(`${API_BASE}/justices`);
            const data = await response.json();
            this.agents = data.justices || [];
            return this.agents;
        } catch (error) {
            console.error('Failed to fetch agents:', error);
            return this.getFallbackAgents();
        }
    }

    async getAgentStatus() {
        try {
            const response = await fetch(`${API_BASE}/agents/status`);
            return await response.json();
        } catch (error) {
            return { agents: this.getFallbackAgents(), timestamp: new Date().toISOString() };
        }
    }

    async sendMessage(content, sender = 'user') {
        try {
            const response = await fetch(`${API_BASE}/message`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content, sender, timestamp: new Date().toISOString() })
            });
            const data = await response.json();
            return {
                userMessage: data.user_message,
                agentResponses: data.responses.map(r => ({
                    role: 'agent', content: r.content, agent: r.agent,
                    agentName: r.agent_name, emoji: r.emoji || '🤖', type: r.type,
                    timestamp: new Date().toISOString()
                })),
                agentsInvolved: data.agents_involved || []
            };
        } catch (error) {
            console.error('Error sending message:', error);
            return {
                userMessage: { role: 'user', content, sender, timestamp: new Date().toISOString() },
                agentResponses: [{ role: 'agent', content: '⚠️ Connection interrupted. Using local response.', agent: 'system', agentName: 'System', emoji: '⚠️', type: 'system', timestamp: new Date().toISOString() }],
                agentsInvolved: ['system']
            };
        }
    }

    async getConversationHistory(limit = 50) {
        try {
            const response = await fetch(`${API_BASE}/conversations?limit=${limit}`);
            const data = await response.json();
            return data.messages || [];
        } catch (error) {
            return [];
        }
    }

    async getSkills() {
        try {
            const response = await fetch(`${API_BASE}/skills`);
            const data = await response.json();
            return data.skills || [];
        } catch (error) {
            return [];
        }
    }

    async checkHealth() {
        try {
            const response = await fetch(`${API_BASE}/health`);
            const data = await response.json();
            return data.status === 'healthy';
        } catch (error) {
            return false;
        }
    }

    getFallbackAgents() {
        return [
            { id: "evolver-1", name: "Evolver Agent", emoji: "🧬", type: "evolution", status: "offline" },
            { id: "memory-1", name: "Memory Keeper", emoji: "🧠", type: "memory", status: "offline" },
            { id: "coord-1", name: "Coordinator", emoji: "🤔", type: "coordination", status: "offline" },
            { id: "guard-1", name: "Guardian", emoji: "🛡️", type: "security", status: "offline" },
            { id: "build-1", name: "Builder", emoji: "🛠️", type: "construction", status: "offline" },
            { id: "scan-1", name: "Scanner", emoji: "🔍", type: "analysis", status: "offline" }
        ];
    }
}

const rezstackChatService = new RezStackChatService();
if (typeof window !== 'undefined') {
    setTimeout(() => { rezstackChatService.connectWebSocket(); }, 1000);
}
export default rezstackChatService;
