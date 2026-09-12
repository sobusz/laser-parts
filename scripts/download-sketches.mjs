import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dir = join(dirname(fileURLToPath(import.meta.url)), "../client/public/catalog");
mkdirSync(dir, { recursive: true });

const files = [
  "Obraz1.png",
  "Obraz2.png",
  "Obraz3.png",
  "Obraz4.png",
  "Obraz5.png",
  "Obraz6.png",
  "Obraz7.png",
  "Obraz8.png",
  "Obraz9.png",
  "Obraz10.png",
  "Obraz11.png",
  "Obraz15.png",
  "Obraz16.png",
  "Obraz17.png",
  "Obraz19.png",
  "Obraz20.png",
  "Obraz21.png",
  "Obraz22.png",
  "Obraz1-1.png",
];

const base = "https://laser-parts.pl/wp-content/uploads/2022/01/";

for (const file of files) {
  const res = await fetch(base + file);
  if (!res.ok) {
    console.error("FAIL", file, res.status);
    continue;
  }
  writeFileSync(join(dir, file), Buffer.from(await res.arrayBuffer()));
  console.log("ok", file, res.headers.get("content-length"));
}
