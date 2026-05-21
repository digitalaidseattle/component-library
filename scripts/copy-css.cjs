const fs = require("fs");
const path = require("path");

const sourceDir = path.join(process.cwd(), "src");
const targetDir = path.join(process.cwd(), "dist");

if (!fs.existsSync(sourceDir)) {
  process.exit(0);
}

fs.mkdirSync(targetDir, { recursive: true });

for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
  if (!entry.isFile() || !entry.name.endsWith(".css")) {
    continue;
  }

  fs.copyFileSync(
    path.join(sourceDir, entry.name),
    path.join(targetDir, entry.name)
  );
}
