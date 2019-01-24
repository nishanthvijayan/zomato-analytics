const { groupBySum, getDayName, printBars } = require('./utils.js');

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

module.exports = {
  printOrderByRestaurantsGraph,
  printTopMonthGraph,
  printOrdersOfLastMonthsGraph,
  printOrdersByDayGraph,
  printOrdersByDateGraph,
};
