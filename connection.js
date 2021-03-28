const mongoose = require('mongoose');
// connect to mongoDB

module.exports = () => {
    mongoose.connect('mongodb://localhost/auth1');
    mongoose.connection.once('open', ()=> {
        console.log('connected to database');
    }).on('error', (err) => console.log(err));
}