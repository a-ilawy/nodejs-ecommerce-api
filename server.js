const express = require('express');
const dotenv = require('dotenv');
const moragn = require('morgan');
const dbConnection = require('./config/database');
const categoryRoute = require('./routes/categoryRoute');
dotenv.config({ path: 'config.env' });
const app = express();

app.use(express.json());
if (process.env.NODE_ENV === 'development') {

    app.use(moragn('dev'));
    console.log('mode: development');

}

dbConnection();


app.use('/api/v1/categories', categoryRoute);

app.get('/', (req, res) => {
    res.send('Our Api v1');
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`App running on port ${port}`);

});