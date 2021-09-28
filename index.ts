import { sonarScanner } from './src/sonarScanner';
import * as core from '@actions/core';

async function run(): Promise<void> {
  try {
    await sonarScanner();
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
  }
}

run();
