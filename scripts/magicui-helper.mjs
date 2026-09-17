import { spawn } from 'child_process';
import fs from 'fs';

export async function callMcpTool(toolName, toolArgs = {}) {
  return new Promise((resolve, reject) => {
    const proc = spawn('cmd.exe', ['/c', 'npx', '-y', '@magicuidesign/mcp@latest'], {
      stdio: ['pipe', 'pipe', 'inherit']
    });

    let buffer = '';
    const timeout = setTimeout(() => {
      proc.kill();
      reject(new Error('Timeout calling MCP tool ' + toolName));
    }, 20000);

    proc.stdout.on('data', (d) => {
      buffer += d.toString();
      const lines = buffer.split('\n');
      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const res = JSON.parse(line);
          if (res.id === 1) {
            clearTimeout(timeout);
            proc.kill();
            resolve(res.result);
            return;
          }
        } catch (e) {
          // keep accumulating
        }
      }
    });

    proc.on('error', (err) => {
      clearTimeout(timeout);
      reject(err);
    });

    setTimeout(() => {
      const req = JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/call',
        params: {
          name: toolName,
          arguments: toolArgs
        }
      }) + '\n';
      proc.stdin.write(req);
    }, 2000);
  });
}

// CLI runner
const [action, ...args] = process.argv.slice(2);
if (action === 'list') {
  const kind = args[0];
  const query = args[1];
  const res = await callMcpTool('listRegistryItems', { limit: 150, kind, query });
  console.log(JSON.stringify(res, null, 2));
} else if (action === 'search') {
  const query = args[0];
  const res = await callMcpTool('searchRegistryItems', { query, limit: 50 });
  console.log(JSON.stringify(res, null, 2));
} else if (action === 'get') {
  const name = args[0];
  const res = await callMcpTool('getRegistryItem', { name, includeSource: true, includeExamples: true });
  console.log(JSON.stringify(res, null, 2));
}
