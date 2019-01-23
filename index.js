const fs = require('fs');
const { printBars } = require('./bars');
const scrapeZomatoOrders = require('./zomato');

const DayMap = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
};

const groupBySum = (arr, keySelector, valueSelector) => arr.reduce((acc, item) => {
  const key = keySelector(item);
  const value = valueSelector(item);

  if (acc[key]) {
    acc[key] += value;
  } else {
    acc[key] = value;
  }

  return acc;
}, {});


async function main() {
  const ordersFromZomato = await scrapeZomatoOrders();
  fs.writeFileSync('orders.json', JSON.stringify(ordersFromZomato));

  const isDelivered = ({ status }) => status === 'Delivered';
  const orders = JSON.parse(fs.readFileSync('orders.json')).filter(isDelivered);

  const getOrderCost = order => order.cost;

  const getOrderRestaurant = order => order.restaurant;
  const ordersByRestaurant = groupBySum(orders, getOrderRestaurant, getOrderCost);

  const getOrderMonth = order => order.date.slice(3);
  const ordersByMonth = groupBySum(orders, getOrderMonth, getOrderCost);

  const getOrderDay = order => DayMap[new Date(order.date).getDay()];
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
