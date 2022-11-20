import {loadDirectory} from "diload";

async function main() {
  const data = await loadDirectory("./data");

  console.log(data);
}

main();
