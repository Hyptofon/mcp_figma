// ─── MCP Server Entry Point ───

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createServer } from './server.js';

async function main() {
    const server = createServer();
    const transport = new StdioServerTransport();

    await server.connect(transport);

    console.error('🚀 Figma-to-Code MCP server started (stdio transport)');

    // Graceful shutdown
    process.on('SIGINT', async () => {
        console.error('\\n🛑 Shutting down MCP server...');
        await server.close();
        process.exit(0);
    });

    process.on('SIGTERM', async () => {
        await server.close();
        process.exit(0);
    });
}

main().catch((error) => {
    console.error('❌ Failed to start MCP server:', error);
    process.exit(1);
});
