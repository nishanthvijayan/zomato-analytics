const cli = require('commander');
const fs = require('fs');
const { printBars } = require('./utils');
const scrapeZomatoOrders = require('./zomato');
const { groupBySum, getDayName } = require('./utils.js');

const ORDERS_OUTPUT_FILE = 'orders.json';
const readOrdersFromFile = () => JSON.parse(fs.readFileSync(ORDERS_OUTPUT_FILE));

const isOrderDelivered = order => order.status === 'Delivered';
const getOrderCost = order => order.cost;
const getOrderRestaurant = order => order.restaurant;
const getOrderMonth = order => order.date.slice(3);
const getOrderDay = order => getDayName(order.date);
const getOrderDate = order => new Date(order.date).getDate();

const printOrdersByDateGraph = (orders) => {
  const ordersByDate = groupBySum(orders, getOrderDate, getOrderCost);

  const sortByLabelAsc = (a, b) => a.label - b.label;
  printBars(ordersByDate, { sortFn: sortByLabelAsc, top: 31 });
};

const printOrdersByDayGraph = (orders) => {
  const ordersByDay = groupBySum(orders, getOrderDay, getOrderCost);
  printBars(ordersByDay);
};

const printTopMonthGraph = (orders, n) => {
  const ordersByMonth = groupBySum(orders, getOrderMonth, getOrderCost);

  const sortByEarliest = (a, b) => Date.parse(`01 ${b.label}`) - Date.parse(`01 ${a.label}`);
  printBars(ordersByMonth, { sortFn: sortByEarliest, top: n });
};

const printOrdersOfLastMonthsGraph = (orders, n) => {
  const ordersByMonth = groupBySum(orders, getOrderMonth, getOrderCost);
  printBars(ordersByMonth, { top: n });
};

const printOrderByRestaurantsGraph = (orders, n) => {
  const ordersByRestaurant = groupBySum(orders, getOrderRestaurant, getOrderCost);
  printBars(ordersByRestaurant, { top: n });
};

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

  orders = orders.filter(isOrderDelivered);

  console.log('Top Restaurants\n');
  printOrderByRestaurantsGraph(orders, 5);

  console.log('\n\nTop Months\n');
  printTopMonthGraph(orders, 5);

  console.log('\n\nLast 24 Months\n');
  printOrdersOfLastMonthsGraph(orders, 24);

  console.log('\n\nDays\n');
  printOrdersByDayGraph(orders);

  console.log('\n\nDates\n');
  printOrdersByDateGraph(orders);
}

main();
