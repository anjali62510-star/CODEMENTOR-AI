const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, 'scratch_run.log');
const stream = fs.createWriteStream(logFile, { flags: 'a' });

stream.write(`=== Starting command at ${new Date().toISOString()} ===\n`);

// Run server.ts using tsx
const cmd = 'npx.cmd';
const args = ['tsx', 'server.ts'];

const child = spawn(cmd, args, {
  cwd: 'c:\\Users\\YOGENDRA SINGH\\OneDrive\\Desktop\\codementor-ai',
  shell: true
});

child.stdout.on('data', (data) => {
  stream.write(data);
});

child.stderr.on('data', (data) => {
  stream.write(data);
});

child.on('close', (code) => {
  stream.write(`=== Process exited with code ${code} ===\n`);
  stream.end();
});
