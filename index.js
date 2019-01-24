const cli = require('commander');
const fs = require('fs');
const scrapeZomatoOrders = require('./zomato');
const {
  printOrderByRestaurantsGraph,
  printTopMonthGraph,
  printOrdersOfLastMonthsGraph,
  printOrdersByDayGraph,
  printOrdersByDateGraph,
} = require('orders.js');

const ORDERS_OUTPUT_FILE = 'orders.json';
const readOrdersFromFile = () => JSON.parse(fs.readFileSync(ORDERS_OUTPUT_FILE));

const parseCLIArgs = () => {
  cli
    .version('0.1.0')
    .option('-i, --input [file]', 'Read order from file')
    .option('-o, --output [file]', 'Write the extracted orders to file')
    .parse(process.argv);
};

async function main() {
  parseCLIArgs();

  let orders;
  if (cli.input) {
    orders = readOrdersFromFile();
  } else {
    orders = await scrapeZomatoOrders();

    if (cli.output) {
      fs.writeFileSync(ORDERS_OUTPUT_FILE, JSON.stringify(orders));
    }
  }

  const isOrderDelivered = ({ status }) => status === 'Delivered'
  const deliveredOrders = orders.filter(isOrderDelivered);

  console.log('Top Restaurants\n');
  printOrderByRestaurantsGraph(deliveredOrders, 5);

  console.log('\n\nTop Months\n');
  printTopMonthGraph(deliveredOrders, 5);

  console.log('\n\nLast 24 Months\n');
  printOrdersOfLastMonthsGraph(deliveredOrders, 24);

  console.log('\n\nDays\n');
  printOrdersByDayGraph(deliveredOrders);

  console.log('\n\nDates\n');
  printOrdersByDateGraph(deliveredOrders);
}

main();
