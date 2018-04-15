var mysql = require("mysql");
var inquirer = require('inquirer');
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  queryAllProducts();
  //queryDanceSongs();
});

function queryAllProducts() {
  connection.query("SELECT * FROM products", function(err, res) {
    for (var i = 0; i < res.length; i++) {
      console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + "$" + res[i].price + " | " + res[i].stock_quantity);
    }
    console.log("-----------------------------------");
    userInput();
  });
var userInput = function() {
inquirer.prompt([

    {
      type: "input",
      name: "item_number",
      message: "What is the number of the product you wish to purchase?"
    },
    {
        type: "input",
        name: "quantity",
        message: "How many do you wish to purchase?"
    }

]).then(function(answers){
   var item_number = answers.item_number;
   var quantity = answers.quantity;
    console.log(item_number);
    console.log(quantity);
        
}).catch(function(err){
    console.log(err);
    });
};
connection.end();
}