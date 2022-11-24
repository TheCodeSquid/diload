import {existsSync} from "fs";
import {lstat, readdir, readFile} from "fs/promises";
import path from "path";

const metaFile = "[meta].json";

function warn(file: string, msg: string) {
  console.error(`[warning][${file}]: ${msg}`)
}

/**
 * Recursively load data from directory `dir`.
 *
 * By default, files and subdirectories are put directly into the parent directory object,
 * but they can be aggregated into a specific key if `aggregateName` is specified.
 *
 * `aggregateName` must be specified to make use of the `[meta.json]` files
 * for adding data to directories. If left unset, the meta files will be ignored.
 *
 * @param dir The root directory to be traversed.
 * @param aggregateName The key that child data will be aggregated under.
 */
export async function loadDirectory(dir: string, aggregateName?: string): Promise<Record<string, any>> {
  const obj: Record<string, any> = {};

  for (const name of await readdir(dir)) {
    const file = path.join(dir, name);

    const stat = await lstat(file);
    if (stat.isDirectory()) {
      let dirObj: Record<string, any>;
      // Note to self: Don't forget to pass all function arguments here
      const subdir = await loadDirectory(file, aggregateName);

      if (aggregateName !== undefined) {
        const metaPath = path.join(file, metaFile);
        if (existsSync(metaPath)) {
          dirObj = await loadFile(metaPath);
        } else {
          dirObj = {};
        }

        if (aggregateName in dirObj) {
          warn(file, "aggregate key present in meta file, overwriting");
        }
        dirObj[aggregateName] = subdir;
      } else {
        dirObj = subdir;
      }

      obj[name] = dirObj;
    } else if (path.extname(file) === ".json" && path.basename(file) !== metaFile) {
      obj[name] = await loadFile(file);
    }
  }

  return obj;
}

/**
 * Loads a JSON file.
 */
export async function loadFile(path: string): Promise<Record<string, any>> {
  const buf = await readFile(path);
  const decoder = new TextDecoder();
  const text = decoder.decode(buf);

  return JSON.parse(text);
}
