const fs = require("fs");
const path = require("path");
const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

try {
  require("chromedriver");
} catch {
  // Selenium Manager can still resolve ChromeDriver when chromedriver is absent.
}

const projectRoot = path.join(__dirname, "..");
const sidePath = path.join(projectRoot, "tests", "selenium", "ringkasan-blackbox.side");
const project = JSON.parse(fs.readFileSync(sidePath, "utf8"));

const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, value = "true"] = arg.replace(/^--/, "").split("=");
    return [key, value];
  })
);

const delayMs = Number(args.get("delay") || 900);
const holdMs = Number(args.get("hold") || 15000);
const baseUrl = args.get("base-url") || project.url || "http://localhost:3000";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function substitute(value, variables) {
  if (!value) return value;
  return value.replace(/\$\{([^}]+)\}/g, (_, name) => variables[name] ?? "");
}

function byTarget(target, variables) {
  const resolved = substitute(target, variables);

  if (resolved.startsWith("css=")) {
    return By.css(resolved.slice(4));
  }

  if (resolved.startsWith("xpath=")) {
    return By.xpath(resolved.slice(6));
  }

  throw new Error(`Locator belum didukung: ${target}`);
}

function globToRegExp(glob) {
  const escaped = glob
    .replace(/^glob:/, "")
    .replace(/[.+^${}()|[\]\\]/g, "\\$&")
    .replace(/\*/g, ".*");

  return new RegExp(`^${escaped}$`);
}

async function findElement(driver, target, variables) {
  return driver.findElement(byTarget(target, variables));
}

async function runCommand(driver, command, variables) {
  const target = substitute(command.target || "", variables);
  const value = substitute(command.value || "", variables);

  switch (command.command) {
    case "open": {
      const url = new URL(target || "/", baseUrl).toString();
      await driver.get(url);
      break;
    }

    case "click":
      await (await findElement(driver, command.target, variables)).click();
      break;

    case "type": {
      const element = await findElement(driver, command.target, variables);
      await element.clear();
      await element.sendKeys(value);
      break;
    }

    case "store":
      variables[value] = target;
      break;

    case "executeScript": {
      if (target.includes("localStorage")) {
        const currentUrl = await driver.getCurrentUrl();

        if (!currentUrl.startsWith("http://") && !currentUrl.startsWith("https://")) {
          await driver.get(baseUrl);
        }
      }

      const result = await driver.executeScript(target);
      if (value) {
        variables[value] = String(result);
      }
      break;
    }

    case "assert": {
      if (target !== value) {
        throw new Error(`Assert gagal: nilai "${target}" tidak sama dengan "${value}"`);
      }
      break;
    }

    case "assertText": {
      const text = await (await findElement(driver, command.target, variables)).getText();
      if (text.trim() !== value) {
        throw new Error(`Assert text gagal: "${text.trim()}" tidak sama dengan "${value}"`);
      }
      break;
    }

    case "assertElementPresent":
      await findElement(driver, command.target, variables);
      break;

    case "assertElementNotPresent": {
      try {
        await findElement(driver, command.target, variables);
        throw new Error(`Assert element not present gagal: Elemen "${command.target}" masih ditemukan`);
      } catch (err) {
        if (err.message.includes("Assert element not present gagal")) {
          throw err;
        }
        // Jika error karena NoSuchElementError, berarti elemen memang tidak ada (Passed)
      }
      break;
    }

    case "waitForElementPresent":
      await driver.wait(until.elementLocated(byTarget(command.target, variables)), Number(value || 10000));
      break;

    case "assertAttribute": {
      const atIndex = target.lastIndexOf("@");
      const locator = target.slice(0, atIndex);
      const attribute = target.slice(atIndex + 1);
      const actual = await (await findElement(driver, locator, variables)).getAttribute(attribute);
      if (actual !== value) {
        throw new Error(`Assert attribute gagal: ${attribute}="${actual}", harapan="${value}"`);
      }
      break;
    }

    case "assertLocation": {
      const current = await driver.getCurrentUrl();
      if (!globToRegExp(target).test(current)) {
        throw new Error(`Assert location gagal: "${current}" tidak cocok dengan "${target}"`);
      }
      break;
    }

    case "waitForLocation": {
      const matcher = globToRegExp(target);
      await driver.wait(async () => matcher.test(await driver.getCurrentUrl()), Number(value || 10000));
      break;
    }

    default:
      throw new Error(`Command belum didukung visual runner: ${command.command}`);
  }
}

async function main() {
  const options = new chrome.Options();
  options.addArguments("--start-maximized");
  options.excludeSwitches("enable-automation");

  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  const variables = {};
  const results = [];

  for (const test of project.tests) {
    console.log(`\nRunning ${test.name}`);
    let testFailed = false;
    let testError = null;

    try {
      for (const command of test.commands) {
        const label = [command.command, command.comment || command.target]
          .filter(Boolean)
          .join(" - ");

        console.log(`  ${label}`);
        await runCommand(driver, command, variables);
        await sleep(delayMs);
      }
    } catch (error) {
      testFailed = true;
      testError = error.message;
      console.error(`  ✕ Command gagal: ${error.message}`);
    }

    if (testFailed) {
      results.push({ name: test.name, status: "FAILED", error: testError });
    } else {
      results.push({ name: test.name, status: "PASSED" });
    }
  }

  const passedCount = results.filter((r) => r.status === "PASSED").length;
  const failedCount = results.filter((r) => r.status === "FAILED").length;

  console.log(`\n==================================================`);
  console.log(`              RINGKASAN PENGUJIAN VISUAL          `);
  console.log(`==================================================`);
  results.forEach((r) => {
    if (r.status === "PASSED") {
      console.log(`[✓] ${r.name} - (PASSED)`);
    } else {
      console.log(`[✕] ${r.name} - (FAILED: ${r.error})`);
    }
  });
  console.log(`==================================================`);
  console.log(`Total Skenario : ${results.length}`);
  console.log(`Berhasil       : ${passedCount}`);
  console.log(`Gagal          : ${failedCount}`);
  console.log(`Status Akhir   : ${failedCount === 0 ? "SUCCESS" : "FAILED"}`);
  console.log(`==================================================`);

  if (failedCount > 0) {
    process.exitCode = 1;
  }

  console.log(`\nBrowser ditahan ${holdMs / 1000} detik untuk inspeksi.`);
  try {
    await sleep(holdMs);
  } finally {
    await driver.quit();
  }
}

main();
