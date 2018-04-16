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

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  queryAllProducts();
  //queryDanceSongs();
});

function queryAllProducts() {
  connection.query("SELECT * FROM products", function (err, res) {
    for (var i = 0; i < res.length; i++) {
      console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + "$" + res[i].price + " | " + res[i].stock_quantity);
    }
    console.log("-----------------------------------");
    userInput();
  });
  var userInput = function () {
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

    ]).then(function (answers) {

      // check to see if units purchased is < quantity,     
      var query = connection.query("SELECT * FROM products WHERE item_id=?", answers.item_number, function (err, res) {
        // if yes then update SQL to subtract units purchased
        if (answers.quantity > res[0].stock_quantity) {
          console.log("Order too large. We can not fulfill your order.")
        }
        // if no then console.log("Insufficient quantity!");
        else {
          var query = connection.query("UPDATE products SET ? WHERE ?", [{
              stock_quantity: res[0].stock_quantity - answers.quantity
            },
            {
              item_id: answers.item_number
            }
          ]);
          console.log("Your total cost is $" + answers.quantity * res[0].price.toFixed(2));
        };
        connection.end();

      })
    })
  }
}