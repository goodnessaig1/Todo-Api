const express = require('express')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
const mongoose = require('mongoose');
require('dotenv').config();

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());

//         ROUTES
app.use("/api/user", require("./routes/user"));
app.use('/api/todo', require("./routes/todo"))




const port = process.env.PORT || 8000;

app.listen(port,()=> {
    console.log(`Server Running at ${port}`)
})


mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/Todo", {autoIndex: false}).then(() => console.log('connected to DB'))

