const {
  groupBySum, getDayName, printBars, DAY_MAP_INVERSE,
} = require('./utils.js');

const getOrderCost = order => parseFloat(order.cost);
const getOrderRestaurant = order => order.restaurant;
const getOrderMonth = order => order.date.slice(3);
const getOrderDay = order => getDayName(order.date);
const getOrderDate = order => new Date(order.date).getDate();

const sortByEarliestMonth = (a, b) => Date.parse(`01 ${b.label}`) - Date.parse(`01 ${a.label}`);
const sortByEarliestDay = (a, b) => DAY_MAP_INVERSE[a.label] - DAY_MAP_INVERSE[b.label];
const sortByLabelAsc = (a, b) => a.label - b.label;

const calculateTotalMoneySpent = orders => orders.reduce((sum, order) => sum + getOrderCost(order), 0).toFixed(2);

const printOrdersByDateGraph = (orders) => {
  const ordersByDate = groupBySum(orders, getOrderDate, getOrderCost);
  printBars(ordersByDate, { sortFn: sortByLabelAsc, top: 31 });
};

const printOrdersByDayGraph = (orders) => {
  const ordersByDay = groupBySum(orders, getOrderDay, getOrderCost);
  printBars(ordersByDay, { sortFn: sortByEarliestDay });
};

const printTopMonthGraph = (orders, n) => {
  const ordersByMonth = groupBySum(orders, getOrderMonth, getOrderCost);
  printBars(ordersByMonth, { top: n });
};

const printOrdersOfLastMonthsGraph = (orders, n) => {
  const ordersByMonth = groupBySum(orders, getOrderMonth, getOrderCost);
  printBars(ordersByMonth, { sortFn: sortByEarliestMonth, top: n });
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
  calculateTotalMoneySpent
};
