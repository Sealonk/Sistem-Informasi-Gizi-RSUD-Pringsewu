const childProcess = require("child_process");
const path = require("path");

try {
  require("chromedriver");
} catch {
  // Selenium Manager can still resolve ChromeDriver when chromedriver is absent.
}

const runnerJestBin = path.join(
  __dirname,
  "..",
  "node_modules",
  "selenium-side-runner",
  "node_modules",
  "jest",
  "bin",
  "jest.js"
);

const resolveBin = require("resolve-bin");
const originalResolveBinSync = resolveBin.sync;

resolveBin.sync = function patchedResolveBinSync(packageName, options) {
  if (packageName === "jest") {
    return runnerJestBin;
  }

  return originalResolveBinSync.call(this, packageName, options);
};

const originalSpawn = childProcess.spawn;

childProcess.spawn = function patchedSpawn(command, args, options) {
  if (
    typeof command === "string" &&
    command.startsWith("node ") &&
    options &&
    options.shell === true
  ) {
    const scriptPath = command.slice("node ".length);

    return originalSpawn(process.execPath, [scriptPath, ...(args || [])], {
      ...options,
      shell: false,
    });
  }

  return originalSpawn(command, args, options);
};

require(path.join(
  __dirname,
  "..",
  "node_modules",
  "selenium-side-runner",
  "dist",
  "bin.js"
));
