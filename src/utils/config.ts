import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const CONFIG_PATH = path.join(os.homedir(), '.devbrain.json');

export function getConfig() {
  if (!fs.existsSync(CONFIG_PATH)) return { model: 'openrouter/free' }; // Default
  return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
}

export function setConfig(key: string, value: string) {
  const config = getConfig();
  config[key] = value;
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
}