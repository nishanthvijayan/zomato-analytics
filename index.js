const fs = require('fs');
const { printBars } = require('./utils');
const scrapeZomatoOrders = require('./zomato');
const { groupBySum, getDayName } = require('./utils.js');

const ORDERS_OUTPUT_FILE = 'orders.json';

async function main() {
  const ordersFromZomato = await scrapeZomatoOrders();
  fs.writeFileSync(ORDERS_OUTPUT_FILE, JSON.stringify(ordersFromZomato));

  const isDelivered = ({ status }) => status === 'Delivered';
  const orders = JSON.parse(fs.readFileSync(ORDERS_OUTPUT_FILE)).filter(isDelivered);

  const getOrderCost = order => order.cost;

  const getOrderRestaurant = order => order.restaurant;
  const ordersByRestaurant = groupBySum(orders, getOrderRestaurant, getOrderCost);

  const getOrderMonth = order => order.date.slice(3);
  const ordersByMonth = groupBySum(orders, getOrderMonth, getOrderCost);

  const getOrderDay = order => getDayName(order.date);
  const ordersByDay = groupBySum(orders, getOrderDay, getOrderCost);

  // const getOrderDate = order => new Date(order.date).getDate();
  // const ordersByDate = groupBySum(orders, getOrderDate, getOrderCost);

  console.log('Top Restaurants\n');
  printBars(ordersByRestaurant);

  // console.log("\n --- \n")
  // console.log("Top Months\n")
  // printBars(ordersByMonth, {top: 5})

  console.log('\n --- \n');
  console.log('Last 24 Months\n');
  const sortByEarliest = (a, b) => Date.parse(`01 ${b.label}`) - Date.parse(`01 ${a.label}`);
  printBars(ordersByMonth, { sortFn: sortByEarliest, top: 24 });

  console.log('\n --- \n');
  console.log('Days\n');
  printBars(ordersByDay);

  // console.log("\n --- \n")
  // console.log("Dates\n")
  // const sortByLabelAsc = (a, b) => a.label - b.label
  // printBars(ordersByDate, { sortFn: sortByLabelAsc, top: 31})
}

main();
