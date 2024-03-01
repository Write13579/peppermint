import puppeteer from "puppeteer";

const main = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  while (true) {}
};

main().then((r) => r);
