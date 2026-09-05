#!/usr/bin/env node
/* eslint-disable */
'use strict';

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');

const ROOT = path.resolve(__dirname, '..');
const PORT = process.env.DASHBOARD_PORT || 4500;
const RESULTS_FILE = path.join(ROOT, '.dashboard-results.json');
const COVERAGE_SUMMARY = path.join(ROOT, 'coverage', 'coverage-summary.json');

const state = {
  status: 'idle',
  startedAt: null,
  finishedAt: null,
  results: null,
  coverage: null,
  error: null,
};

let running = false;
let pending = false;
let debounceTimer = null;

function runTests() {
  if (running) {
    pending = true;
    return;
  }
  running = true;
  state.status = 'running';
  state.startedAt = new Date().toISOString();
  broadcast();

  const args = [
    'jest',
    '--json',
    `--outputFile=${RESULTS_FILE}`,
    '--coverage',
    '--coverageReporters=json-summary',
  ];

  const child = spawn('npx', args, { cwd: ROOT, shell: process.platform === 'win32' });
  let stderr = '';
  child.stderr.on('data', (chunk) => {
    stderr += chunk.toString();
  });

  child.on('close', () => {
    try {
      state.results = JSON.parse(fs.readFileSync(RESULTS_FILE, 'utf8'));
      state.coverage = fs.existsSync(COVERAGE_SUMMARY)
        ? JSON.parse(fs.readFileSync(COVERAGE_SUMMARY, 'utf8'))
        : null;
      state.error = null;
    } catch (err) {
      state.error = stderr.trim() || String(err);
    }
    state.status = 'done';
    state.finishedAt = new Date().toISOString();
    running = false;
    broadcast();

    if (pending) {
      pending = false;
      runTests();
    }
  });
}

function scheduleRun() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(runTests, 300);
}

const clients = new Set();

function broadcast() {
  const payload = `data: ${JSON.stringify(state)}\n\n`;
  for (const res of clients) {
    res.write(payload);
  }
}

for (const dir of ['src', 'test']) {
  const full = path.join(ROOT, dir);
  if (!fs.existsSync(full)) continue;
  fs.watch(full, { recursive: true }, (_eventType, filename) => {
    if (filename && filename.endsWith('.ts')) {
      scheduleRun();
    }
  });
}

const DASHBOARD_HTML = fs.readFileSync(path.join(__dirname, 'dashboard.html'), 'utf8');

const server = http.createServer((req, res) => {
  if (req.url === '/events') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });
    res.write(`data: ${JSON.stringify(state)}\n\n`);
    clients.add(res);
    req.on('close', () => clients.delete(res));
    return;
  }

  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(DASHBOARD_HTML);
});

server.listen(PORT, () => {
  console.log(`Test dashboard: http://localhost:${PORT}`);
  console.log('Watching src/ and test/ for changes...');
  runTests();
});
