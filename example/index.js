import {loadDirectory} from "diload";

async function main() {
  const data = await loadDirectory("./data", "content");

  console.log(JSON.stringify(data, null, 2));
}

main();
