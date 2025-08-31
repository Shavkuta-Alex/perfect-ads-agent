import fs from "fs";

export function parseCsv(csv: string) {
  const [header, ...rows] = csv.split("\n");

  return rows;
}

export function chunk(array: any[], size: number) {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
    array.slice(i * size, (i + 1) * size)
  );
}

export function readCsv(path: string) {
  const csv = fs.readFileSync(path, "utf8");
  return parseCsv(csv);
}