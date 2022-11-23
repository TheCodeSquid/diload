import {loadDirectory} from "diload";

async function main() {
  const data = await loadDirectory("./data", (name, content) => {
    content["nice"] = true;
    return content;
  });

  console.log(data);
}

main();
