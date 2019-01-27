const chalk = require('chalk');
const cli = require('commander');
const Configstore = require('configstore');
const fs = require('fs');
const promptly = require('promptly');
const pkg = require('./package.json');

const {
  printOrderByRestaurantsGraph,
  printOrdersOfLastMonthsGraph,
  printOrdersByDayGraph,
} = require('./orders.js');
const scrapeZomatoOrders = require('./zomato');

const SECTION_BREAK = '\n\n';

const readOrdersFromFile = file => JSON.parse(fs.readFileSync(file));
const writeOrdersToFile = (orders, file) => fs.writeFileSync(file, JSON.stringify(orders));

const conf = new Configstore(pkg.name);
const getUserCredentials = async () => {
  let emailID = conf.get('emailID');
  let password = conf.get('password');

  if (emailID && password) {
    return { emailID, password };
  }

  emailID = await promptly.prompt('Username / Email: ', { trim: true });
  password = await promptly.prompt('Password: ', { trim: true, silent: true, replace: '*' });

  conf.set('emailID', emailID);
  conf.set('password', password);

  return { emailID, password };
};

async function main() {
  let orders;
  if (cli.input) {
    orders = readOrdersFromFile(cli.input);
  } else {
    const { emailID, password } = await getUserCredentials();
    orders = await scrapeZomatoOrders({ emailID, password });

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
