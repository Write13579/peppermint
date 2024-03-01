import puppeteer from "puppeteer";
import * as dotenv from "dotenv";

dotenv.config();

const LOGIN = process.env.LOGIN!;
const PASSWORD = process.env.PASSWORD!;
const link =
  "https://usoscas.polsl.pl/cas/login?service=https%3A%2F%2Fusosweb.polsl.pl%2Fkontroler.php%3F_action%3Dlogowaniecas%2Findex&locale=pl";

const main = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  while (true) {
    const date = new Date();

    if (date.getMinutes() === 29 && date.getHours() === 19) {
      await page.goto(link);
      await page.waitForSelector("#username");
      await page.type("#username", LOGIN);
      await page.waitForSelector("#password");
      await page.type("#password", PASSWORD);
      await page.click(`button[name="submit"]`);

      await page.waitForSelector("#layout-main-content");
      await page.goto("https://usosweb.polsl.pl/kontroler.php?_action=dla_stud/studia/oceny/index");
      await page.waitForSelector("tr > td > a");

      type PrzedmiotIOcena = {
        przedmiot: string;
        ocena: number;
      };

      let tablica: PrzedmiotIOcena[] = [];

      const tabelki = await page.$$(`#tab2 > tr`);

      tablica = await Promise.all(
        tabelki.map(async (element) => {
          const przedmiot = (await element.$eval("td > a", (el) => el.textContent)) ?? "brak";
          const ocena = (await element.$eval("td > div > span", (el) => el.textContent)) ?? "";
          return { przedmiot, ocena: parseFloat(ocena.replace(",", ".")) };
        })
      );

      console.log(tablica);

      await page.goto("https://usosweb.polsl.pl/kontroler.php?_action=logowaniecas/wyloguj");
    }

    await new Promise((res) => {
      setTimeout(res, 1000);
    });
  }
};

main().then((r) => r);
