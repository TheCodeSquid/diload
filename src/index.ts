import {existsSync} from "fs";
import {lstat, readdir, readFile} from "fs/promises";
import path from "path";

const metaFile = "[meta].json";
const aggrKey = "_aggregate";

function warn(file: string, msg: string) {
  console.error(`[warning](${file}): ${msg}`)
}

/**
 * Recursively load data from directory `dir`.
 *
 * By default, files and subdirectories are put directly into the parent directory object,
 * but they can be aggregated into a specific key if `_aggregate` is specified in the `[meta].json` file.
 *
 * @param dir The root directory to be traversed.
 */
export async function loadDirectory(dir: string): Promise<Record<string, any>> {
  const obj: Record<string, any> = {};

  for (const name of await readdir(dir)) {
    const file = path.join(dir, name);

    const stat = await lstat(file);
    if (stat.isDirectory()) {
      let dirObj: Record<string, any>;
      // Note to self: Don't forget to pass all function arguments here
      const subdir = await loadDirectory(file);

      const metaPath = path.join(file, metaFile);
      if (existsSync(metaPath)) {
        dirObj = await loadFile(metaPath);

        if (aggrKey in dirObj) {
          const aggrName: string = dirObj[aggrKey];
          delete dirObj[aggrKey];

          if (aggrName in dirObj) {
            warn(metaPath, "aggregate key present in meta file, overwriting");
          }

          dirObj[aggrName] = subdir;
        } else {
          warn(metaPath, "meta file present but contains no aggregate key, ignoring");
          dirObj = subdir;
        }
      } else {
        dirObj = subdir;
      }

      obj[name] = dirObj;
    } else if (path.extname(file) === ".json" && path.basename(file) !== metaFile) {
      const id = path.basename(name, ".json");

      obj[id] = await loadFile(file);
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
