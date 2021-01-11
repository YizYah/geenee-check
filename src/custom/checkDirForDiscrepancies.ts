import {discrepanciesFound} from './discrepanciesFound'
import execa = require('execa')

const fs = require('fs-extra')

export async function checkDirForDiscrepancies(
  diffsFile: string,
  originalDir: string,
  generatedDir: string,
  logFile: string,
  problemsFound: boolean,
) {
  let newProblemsFound = false
  try {
    // const subprocess = execa('diff', ['exclude="node_modules"', '-rbBw', originalDir, generatedDir])
    const subprocess = execa('diff', ['-x', 'meta', '-x', 'node_modules', '-rbBw', originalDir, generatedDir])

    if (!subprocess.stdout) return false
    await subprocess.stdout.pipe(fs.createWriteStream(diffsFile))

    newProblemsFound = await discrepanciesFound(
      diffsFile, logFile, problemsFound
    )
  } catch (error) {
    throw error
  }

  return newProblemsFound
}

