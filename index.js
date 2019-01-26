const cli = require('commander');
const chalk = require('chalk');

const fs = require('fs');
const {
  printOrderByRestaurantsGraph,
  printOrdersOfLastMonthsGraph,
  printOrdersByDayGraph,
} = require('./orders.js');
const scrapeZomatoOrders = require('./zomato');

const SECTION_BREAK = '\n\n';

const ORDERS_OUTPUT_FILE = 'orders.json';
const readOrdersFromFile = () => JSON.parse(fs.readFileSync(ORDERS_OUTPUT_FILE));
const writeOrdersToFile = orders => fs.writeFileSync(ORDERS_OUTPUT_FILE, JSON.stringify(orders));

async function main() {
  let orders;
  if (cli.input) {
    orders = readOrdersFromFile();
  } else {
    orders = await scrapeZomatoOrders();

    if (cli.output) {
      writeOrdersToFile(orders);
    }
  }

  const isOrderDelivered = ({ status }) => status === 'Delivered';
  const deliveredOrders = orders.filter(isOrderDelivered);
  console.log(chalk.bold(`\nYour total delivered orders are: ${chalk.cyan.bold(deliveredOrders.length)}`));

  console.log(SECTION_BREAK);

  console.log(chalk.bold("Top 10 Restaurants from where you've ordered:"));
  printOrderByRestaurantsGraph(deliveredOrders, 10);

  console.log(SECTION_BREAK);

  console.log(chalk.bold('Distribution of your spendings over the last 12 Months:'));
  printOrdersOfLastMonthsGraph(deliveredOrders, 12);

  console.log(SECTION_BREAK);

  console.log(chalk.bold('Weekday wise distribution of your spendings:'));
  printOrdersByDayGraph(deliveredOrders);
}

cli
  .version('0.1.0')
  .option('-i, --input [file]', 'Read order from file')
  .option('-o, --output [file]', 'Write the extracted orders to file')
  .parse(process.argv);

main();
