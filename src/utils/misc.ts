import * as path from 'path';
import * as fs from 'fs';

/**
 * Gets root by walking up node_modules
 */
export function getProjectRoot(startPath?: string) {
  const _startPath = startPath ?? __dirname;

  if (
    fs.existsSync(path.join(_startPath, 'package.json')) ||
    _startPath === path.parse(_startPath).root
  )
    return _startPath;

  return getProjectRoot(path.parse(_startPath).dir);
}

/**
 * Gets the path of the function that called it.
 *
 * ---
 * Note: It uses an error object to parse out its
 * call stack and reach the last non-internal path.
 */
export function getPathToAnyCallerInModule() {
  const paths = new Error().stack
    ?.split('\n')
    .map((v) => v.trim())
    .filter(
      (line) =>
        (line.includes('.js') || line.includes('.ts')) &&
        !line.includes('(internal'),
    )
    .map((line) => line.match(/\((.*)\/(.*).[j|t]s:\d+:\d+\)/))
    .filter((v) => Boolean(v));

  return paths?.[paths?.length - 1]?.at(1) ?? '';
}
