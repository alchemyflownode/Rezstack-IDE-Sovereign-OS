/**
 * Memory Bridge - Connects Sovereign Memory to Memory API
 */

const MEMORY_API = 'http://localhost:8002';

class MemoryBridge {
    /**
     * Check if Memory API is available
     */
    async isMemoryApiAvailable(): Promise<boolean> {
        try {
            const response = await fetch(`${MEMORY_API}/health`, { 
                method: 'GET',
                signal: AbortSignal.timeout(1000)
            });
            return response.ok;
        } catch {
            return false;
        }
    }

    /**
     * Get remote memories
     */
    async getRemoteMemories(limit: number = 50): Promise<any> {
        try {
            const response = await fetch(`${MEMORY_API}/memories?limit=${limit}`, {
                signal: AbortSignal.timeout(2000)
            });
            if (!response.ok) throw new Error('Failed to fetch memories');
            return await response.json();
        } catch (error) {
            console.warn('Memory API unavailable, using fallback data');
            return { 
                memories: [
                    { content: 'Memory API is offline', type: 'system' },
                    { content: 'Start memory_api.py to enable', type: 'hint' }
                ] 
            };
        }
    }

    /**
     * Get crystals
     */
    async getCrystals(): Promise<any> {
        try {
            const response = await fetch(`${MEMORY_API}/crystals`, {
                signal: AbortSignal.timeout(2000)
            });
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.warn('Crystals unavailable - Memory API offline');
        }
        
        // Return demo crystals when API is offline
        return {
            crystals: [
                { id: 'demo1', content: 'Start Memory API', type: 'hint', created: Date.now() },
                { id: 'demo2', content: 'python memory_api.py', type: 'hint', created: Date.now() },
                { id: 'demo3', content: 'Port 8002', type: 'hint', created: Date.now() }
            ]
        };
    }

    /**
     * Store a memory
     */
    async storeMemory(content: string, type: string = 'conversation', metadata: any = {}): Promise<any> {
        try {
            const response = await fetch(`${MEMORY_API}/memories`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content,
                    type,
                    metadata,
                    timestamp: new Date().toISOString()
                }),
                signal: AbortSignal.timeout(2000)
            });
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.warn('Failed to store memory remotely');
        }
        return { id: 'local-only', local: true };
    }

    /**
     * Search memories
     */
    async search(query: string): Promise<any> {
        try {
            const response = await fetch(`${MEMORY_API}/search?q=${encodeURIComponent(query)}`, {
                signal: AbortSignal.timeout(2000)
            });
            if (response.ok) {
                return await response.json();
            }
        } catch {
            // Silent fail
        }
        return { memories: [] };
    }

    /**
     * Get detailed memory health report
     */
    async getDetailedHealth(): Promise<any> {
        try {
            const response = await fetch(`${MEMORY_API}/health/detailed`, {
                signal: AbortSignal.timeout(3000)
            });
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.warn('Failed to get detailed health:', error);
        }
        return {
            integrityScore: 100,
            totalMemories: 0,
            recommendations: ['Memory API offline']
        };
    }

    /**
     * Get shards (learning units)
     */
    async getShards(type?: string, limit: number = 50): Promise<any> {
        try {
            const url = type 
                ? `${MEMORY_API}/shards?type=${encodeURIComponent(type)}&limit=${limit}`
                : `${MEMORY_API}/shards?limit=${limit}`;
            const response = await fetch(url, {
                signal: AbortSignal.timeout(3000)
            });
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.warn('Failed to get shards:', error);
        }
        return { shards: [], total: 0 };
    }

    /**
     * Consolidate crystals
     */
    async consolidateCrystals(): Promise<any> {
        try {
            const response = await fetch(`${MEMORY_API}/crystals/consolidate`, {
                method: 'POST',
                signal: AbortSignal.timeout(10000)
            });
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.warn('Failed to consolidate crystals:', error);
        }
        return { consolidated: 0 };
    }

    /**
     * Get comprehensive memory stats
     */
    async getMemoryStats(): Promise<any> {
        try {
            const response = await fetch(`${MEMORY_API}/stats`, {
                signal: AbortSignal.timeout(3000)
            });
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.warn('Failed to get memory stats:', error);
        }
        return {
            memories: 0,
            crystals: 0,
            shards: 0,
            health: {}
        };
    }
}

export default new MemoryBridge();
