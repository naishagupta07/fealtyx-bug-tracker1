import fs from "fs";
import path from "path";

export function getUsers() {
  const filePath = path.join(process.cwd(), "data", "users.json");
  const fileData = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(fileData);
}
