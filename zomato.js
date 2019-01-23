const puppeteer = require("puppeteer");
const { emailID, password } = require('./credentials.json');

const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:61.0) Gecko/20100101 Firefox/61.0';
const LANGUAGE_HEADERS = {
  'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
};

const ZOMATO_BASE_URL = "https://www.zomato.com"

const LOG_IN_BUTTON_SELECTOR_ONE = "#signin-link"
const LOG_IN_BUTTON_SELECTOR_TWO = "#login-email"

const USERNAME_SELECTOR = "#ld-email"
const PASSWORD_SELECTOR = "#ld-password"
const LOG_IN_SUBMIT_BUTTON = "#ld-submit-global"

const ORDER_SELECTOR = ".order-history-snippet";
const RESTAURANT_SELECTOR = "div.nowrap";
const COST_SELECTOR = ".cost";
const DATE_SELECTOR = "div.ui.basic.label";
const STATUS_SELECTOR = ".right.floated"
const DROPDOWN_OPTIONS_SELECTOR = 'a.item';
const LOAD_MORE_SELECTOR = "#order-history-load-more > button:nth-child(1)"

const randomDelay = async (page, seconds) => page.waitFor(Math.random() * seconds * 1000);

const inputText = async (page, selector, text) => {
  await randomDelay(page, 2);
  await page.click(selector);
  await page.keyboard.type(text);
}

const getCost = async (order) => order.$eval(COST_SELECTOR, it => parseFloat(parseFloat(it.innerText.slice(1)).toFixed(2)))
const getDate = async (order) => order.$eval(DATE_SELECTOR, it => it.innerText.trim())
const getRestaurant = async (order) => order.$eval(RESTAURANT_SELECTOR, it => it.innerText.trim())
const getStatus = async (order) => order.$eval(STATUS_SELECTOR, it => it.innerText.trim())

const extractOrderDetails = async (order) => ({ 
  cost: await getCost(order),
  date: await getDate(order),
  restaurant: await getRestaurant(order),
  status: await getStatus(order),
});

async function loginToZomato(page) {
  await page.goto(ZOMATO_BASE_URL, {
    waitUntil: 'networkidle2',
  });

  await page.click(LOG_IN_BUTTON_SELECTOR_ONE);
  await page.waitForSelector(LOG_IN_BUTTON_SELECTOR_TWO);
  
  await page.click(LOG_IN_BUTTON_SELECTOR_TWO);
  await inputText(page, USERNAME_SELECTOR, emailID);
  await inputText(page, PASSWORD_SELECTOR, password);

  await page.click(LOG_IN_SUBMIT_BUTTON);
}

async function extractProfileID(page) {

  const profileUrls = await page.$$eval(DROPDOWN_OPTIONS_SELECTOR, links =>
    links
      .map(link => link.href)
      .filter((url) => url.startsWith("https://www.zomato.com/users/"))
  );

  if (Array.isArray(profileUrls) && profileUrls.length > 0) {
    return profileUrls[0].replace("https://www.zomato.com/users/", "").split("/")[0]
  }

  throw "No profile links were found!"
}

async function scrollToBottom(page) {
  while(true) {
    try {
      await page.click(LOAD_MORE_SELECTOR);
      await page.waitForSelector(LOAD_MORE_SELECTOR, {visible: true, timeout: 5000});
    } catch(e) {
      // TODO: Print error only if its not a timeout error
      console.log(e)
      break
    }  
  }
}

async function scrapeZomatoOrders() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setUserAgent(USER_AGENT);
  await page.setExtraHTTPHeaders(LANGUAGE_HEADERS);

  await loginToZomato(page);
  await randomDelay(page, 5);

  const profileID = await extractProfileID(page)
  // console.log(`Profile ID: ${profileID}`)

  const ORDERS_PAGE_URL = `https://www.zomato.com/users/${profileID}/ordering`
  await page.goto(ORDERS_PAGE_URL, {
    waitUntil: 'networkidle2',
  });

  await scrollToBottom(page)

  // const orders = await extractOrders(page);
  const orderDetails = await page.$$(ORDER_SELECTOR)
    .then(orders =>
      Promise.all(orders.map(async (order) => await extractOrderDetails(order)))
    );

  await page.close();
  await browser.close();

  return orderDetails
};

module.exports = scrapeZomatoOrders