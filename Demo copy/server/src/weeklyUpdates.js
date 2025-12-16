import fs from 'fs/promises';
import path from 'path';

const updatesFilePath = path.join(process.cwd(), 'weekly-updates.json');

async function readUpdatesFile() {
  try {
    await fs.access(updatesFilePath);
    const data = await fs.readFile(updatesFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If the file doesn't exist, return an empty object
    if (error.code === 'ENOENT') {
      return {};
    }
    // For other errors, re-throw
    throw error;
  }
}

export async function getWeeklyUpdate(week) {
  const allUpdates = await readUpdatesFile();
  return allUpdates[week] || '';
}

export async function saveWeeklyUpdate(week, text) {
  const allUpdates = await readUpdatesFile();
  allUpdates[week] = text;
  await fs.writeFile(updatesFilePath, JSON.stringify(allUpdates, null, 2));
}
