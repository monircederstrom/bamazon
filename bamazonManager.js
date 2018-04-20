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
    userInput()
  });


var userInput = function () {
inquirer.prompt([
    {
    type: "list",
    name: "options_menu",
    message: "What would you like to do?",
    choices: ["Products for Sale", "Low Inventory", "Add to inventory", "Add new product", "End program"]
    },
    ]).then(function (answers) {
        
        console.log(answers.options_menu);
        
        switch(answers.options_menu){
            case "Products for Sale":
            queryAllProducts();
            break;

            case "Low Inventory":
            lowInventory();
            break;

            case "Add to inventory":
            addInventory()
            break;

            case "Add new product":
            addProduct();
            break;

            case "End program":
            connection.end();
            break;
        //end of switch
        };

    //end of .then answers function
    });

//end of user input()
};

function addProduct() {
    inquirer.prompt([
        {
        type: "input",
        name: "name",
        message: "What product would you like to add?"
        },
        {
        type: "input",
        name: "department",
        message: "What department is your product going to be added to?"
        },
        {
        type: "input",
        name: "cost",
        message: "How much does your product cost?"
        },
        {
        type: "input",
        name: "amount",
        message: "How many units of this product would you like to add?"
        }
        ]).then(function (response) {
console.log("Inserting a new product...\n");
var query = connection.query("INSERT INTO products SET ?", 
    {
    product_name: response.name,
    department_name: response.department,
    price: response.cost,
    stock_quantity: response.amount
    }
);

userInput();
});
};

function lowInventory() {
    var query = "SELECT item_id, product_name, department_name, price, stock_quantity FROM products WHERE stock_quantity BETWEEN 0 and 5";
    connection.query(query, function(err, res) {
      for (var i = 0; i < res.length; i++) {
          for (var i = 0; i<res.length; i++){
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + "$" + res[i].price + " | " + res[i].stock_quantity);
            //end of for loop
            }
            console.log("-----------------------------------");
        
    }
    userInput();
});

};

function queryAllProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + "$" + res[i].price + " | " + res[i].stock_quantity);
        //end of for loop
        }
        console.log("-----------------------------------");
    userInput();
    //end of connection.query
    });
   
//end of queryAllProducts()
};
function addInventory() {
    inquirer.prompt([
        {
        type: "input",
        name: "number",
        message: "What is the product id number of the product would you like to add inventory to?"
        },
        {
        type: "input",
        name: "amount",
        message: "How many units of this product would you like to add?"
        }
        ]).then(function (retort) {
    console.log("Inserting a new product...\n");
    var query = connection.query("SELECT * FROM products WHERE item_id=?", retort.number, function (err, res) {
        var amount =  parseInt(retort.amount);
        var stockMe = res[0].stock_quantity + amount;
    var query = connection.query("UPDATE products SET ? WHERE ?", [{
        stock_quantity: stockMe
      },
      {
        item_id: retort.number
      }
    ],
    function(err, res) {
        
    });
        
       queryAllProducts();
      
    });
 
    userInput();
    });
}


