import {lstat, readdir, readFile} from "fs/promises";
import path from "path";

/**
 * Recursively load data from directory `dir`.
 */
export async function loadDirectory(dir: string): Promise<Record<string, any>> {
  const obj: Record<string, any> = {};

  for (const name of await readdir(dir)) {
    const file = path.join(dir, name);

    const stat = await lstat(file);
    if (stat.isDirectory()) {
      obj[name] = await loadDirectory(file);
    } else if (path.extname(file) === ".json") {
      const buf = await readFile(file);
      const decoder = new TextDecoder();
      const text = decoder.decode(buf);

      obj[path.basename(file, ".json")] = JSON.parse(text);
    }
  }

  return obj;
}
