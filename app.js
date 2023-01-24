// const http = require('http');
const path = require('path');
const express = require('express');
const errorController = require('./controllers/error');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// const mongoConnect = require('./util/database').mongoConnect;
// const expressHbs = require('express-handlebars');
const user = require('./models/user')
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');
// app.engine('hbs',expressHbs({layoutsDir: 'views/layouts', defaultLayout: 'main-layout', extname: 'hbs'}));
// app.set('view engine', 'hbs');
// app.set('view engine', 'pug');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const User = require('./models/user');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req,res,next) => {
    User.findById("63cfb09a4f99513f59a3d6b5")
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
})

app.use('/admin',adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose.connect('mongodb+srv://princeb:prince1234@cluster0.adddb8s.mongodb.net/shop?retryWrites=true&w=majority')
.then(result => {
    User.findOne().then(user => {
        if(!user){
            const user = new User({
                name: 'Prince',
                email: 'princebabariya06@gmail.com',
                cart: {
                    items: []
                }
            });
            user.save();
        }
    })
    app.listen(3000);
})
.catch(err => {
    console.log(err);
})

// mongoConnect(() => {
//     // console.log(client);
//     app.listen(3000);
// });
// app.listen(3000);
// res.status(404).render('404', {pageTitle : 'Page Not Found'});
    // res.status(404).sendFile(path.join(__dirname,'views', '404.html'))
    // res.status(404).send('<h1>Page not found</h1>')


// app.use((req,res,next) => {
//     console.log("I am Middleware");
//     next(); // allow request to continue next middleware in line
// });

// app.use('/add-product',(req,res,next) => {
//     // console.log("I am next Middleware");
//     res.send("<form action = '/product' method = 'POST'><input type = 'text' name = 'title'> <button type = 'submit'>Add Product</button></input></form>")
// }); 

// app.use('/product',(req,res) =>{
//     console.log(req.body);
//     res.redirect('/');
// });
// app.use('/',(req,res,next) => {
//     // console.log("I am next Middleware");
//     res.send("<h1>hello from express js</h1>")
// });

// const server = http.createServer(app); // using express js


// const routes = require('./routes');
// const server = http.createServer(routes);
// const server = http.createServer(routes.handler); // using object
// 1st way to create a server
// http.createServer();

// 2nd way to create a server
// http.createServer(function(req,res){
// });

// 3rd way to create a server
// const server = http.createServer((req,res) => {

    // console.log(req.url, req.method, req.headers);
    // // process.exit();
    // const url = req.url;
    // const method = req.method;  
// });


// server.listen(3000);
