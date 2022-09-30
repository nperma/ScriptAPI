import LZString from "./index.js";
import { http, HttpRequest } from "mojang-net";
import { world } from "mojang-minecraft";

async function Main () {
  const response = await http.request(new HttpRequest('https://docs.microsoft.com/en-us/minecraft/creator/opbuildpdf/toc.pdf'));
  console.log("Response size:", response.body.length);

  let times = 3;
  while ((10 ** times) < response.body.length) {
    let time = Date.now();
    let compressed = LZString.compress(response.body.substring(0, 10 ** times));
    console.log(`Uncompressed size: ${10 ** times} | Compressed size: ${compressed.length} | Time: ${Date.now() - time}ms`);
    times++;
  };
};

let started = false;
world.events.beforeChat.subscribe(() => {
  if (started) return;

  world.getDimension("overworld").runCommand("say Unit test starts");
  started = true;
  Main().catch((err) => {
    console.error(err);
  });
});