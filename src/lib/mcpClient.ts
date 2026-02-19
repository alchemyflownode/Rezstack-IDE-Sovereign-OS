export class MCPClient {
  // Add filesystem method
  async filesystem(method: string, params: any = {}): Promise<any> {
    return this.call('filesystem', method, params);
  }
  private static instance: MCPClient;
  static getInstance() {
    if (!MCPClient.instance) MCPClient.instance = new MCPClient();
    return MCPClient.instance;
  }
  async call(server: string, tool: string, params: any = {}): Promise<any> {
    console.log(`📡 ${server}.${tool}`, params);
    // For mock, return canned responses
    if (server === 'executive') {
      if (tool === 'list_tasks') return { tasks: [{id:1, title:'Example task'}] };
      return { success: true, message: 'Command processed' };
    }
    if (server === 'system_control') {
      if (tool === 'list_processes') return { processes: [{name:'chrome.exe', memory_mb:450}] };
      return { success: true };
    }
    return { success: true };
  }
  async dispatch(server: string, tool: string, params: any = {}): Promise<any> {
    return this.call(server, tool, params);
  }
}
export const mcpClient = MCPClient.getInstance();

