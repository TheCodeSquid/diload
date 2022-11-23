import {lstat, readdir, readFile} from "fs/promises";
import path from "path";

/**
 * Recursively load data from directory `dir`.
 *
 * @param dir The root directory to be traversed.
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

      const name = path.basename(file, ".json");
      obj[name] = JSON.parse(text);
    }
  }

  return obj;
}
