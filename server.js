var express = require('express'),
    customer = require('./routes/customer');
 
var app = express();

app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
});
 
app.get('/customer', customer.findAll);
app.get('/customer/:id', customer.findById);
app.post('/customer', customer.addCustomer);
app.put('/customer/:id', customer.updateCustomer);
app.delete('/customer/:id', customer.deleteCustomer);
 
app.listen(3000);
console.log('Listening on port 3000...');