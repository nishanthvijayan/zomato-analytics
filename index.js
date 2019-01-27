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

const readOrdersFromFile = file => JSON.parse(fs.readFileSync(file));
const writeOrdersToFile = (orders, file) => fs.writeFileSync(file, JSON.stringify(orders));

async function main() {
  let orders;
  if (cli.input) {
    orders = readOrdersFromFile(cli.input);
  } else {
    orders = await scrapeZomatoOrders();

    if (cli.save) {
      writeOrdersToFile(orders, cli.save);
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
  .option('-i, --input <file>', 'Read orders from file')
  .option('-s, --save <file>', 'Save the extracted orders to file')
  .parse(process.argv);

main();
