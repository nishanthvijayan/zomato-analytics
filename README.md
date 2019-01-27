# zomato-analytics
  
![Stats](images/screenshot_summary.png)

`zomato-analytics` is a cli tool to help you analyse your zomato orders. This project is heavily inspired by [swiggy-analytics](https://github.com/mr-karan/swiggy-analytics).

### Warning

`zomato-analytics` needs to login to your Zomato account in order to scrape your order history. Your Zomato account username/email and password lives on your local file system. If you don't feel comfortable entering these details, you can audit the code yourself to be sure that this information is not used in any evil way.  
  
## Setup

Your credentials for Zomato should be stored in a file named `credentials.json` in the following format.
```
{
    "emailID": "example.email@gmail.com",
    "password": "example password"
}
```
Look at the `credentials.example.json` file for reference.

## Executing the script
First install the required dependencies by running: 
```
npm install
```

To start the script, use:
```
node index.js
```

### Options
To save your orders to a json file, use the `-s` / `--save` option:
```
node index.js --save somefile.json
```


To read your orders from a json file instead of crawling zomato, use the `-i` / `--input` option:
```
node index.js --input somefile.json
```
