import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();

const roots = [
  "app",
  "components",
  "lib",
  "docs",
  "public",
  "README.md",
  "STYLE_GUIDE.md",
  "project_rules.md",
];

const ignoreDirs = new Set(["node_modules", ".next", ".git", "dist", "build", "coverage", ".kiro"]);

const fileExts = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".json",
  ".md",
  ".css",
  ".scss",
  ".html",
  ".txt",
]);

const patterns = [
  {
    name: "cp1251-mojibake",
    regex: /Р[\u0400-\u04FF]Р|С[\u0400-\u04FF]Р/g,
  },
  {
    name: "utf8-mojibake-latin",
    regex: /Ð|â|�/g,
  },
];

function shouldScanFile(filePath) {
  const ext = path.extname(filePath);
  return fileExts.has(ext);
}

function scanFile(filePath, results) {
  const content = fs.readFileSync(filePath, "utf8");
  for (const { name, regex } of patterns) {
    regex.lastIndex = 0;
    if (regex.test(content)) {
      results.push({ filePath, issue: name });
      return;
    }
  }
}

function walkDir(dirPath, results) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      if (ignoreDirs.has(entry.name)) continue;
      walkDir(fullPath, results);
      continue;
    }

    if (shouldScanFile(fullPath)) {
      scanFile(fullPath, results);
    }
  }
}

function resolveRoot(item) {
  return path.isAbsolute(item) ? item : path.join(projectRoot, item);
}

function run() {
  const results = [];

  for (const root of roots) {
    const resolved = resolveRoot(root);
    if (!fs.existsSync(resolved)) continue;

    const stat = fs.statSync(resolved);
    if (stat.isDirectory()) {
      walkDir(resolved, results);
    } else if (stat.isFile() && shouldScanFile(resolved)) {
      scanFile(resolved, results);
    }
  }

  if (results.length > 0) {
    console.error("Найдены признаки кракозябр:");
    for (const item of results) {
      console.error(`- ${item.filePath} (${item.issue})`);
    }
    process.exit(1);
  }

  console.log("Кракозябры не найдены.");
}

run();
