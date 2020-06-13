const express = require('express')
require('./Models/LearnModel');

const app = express();
const bodyparser = require('body-parser')
const PORT = process.env.PORT||5000;
const config = require('./config/keys')
const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://sam_user_87:Musk_12345@clusterbot-uchdg.mongodb.net/chatbot?retryWrites=true&w=majority', { useNewUrlParser: true })

app.use(bodyparser.json())
require('./Routes/Dialogflowroutes')(app)

if (process.env.NODE_ENV === 'production') {

    app.use(express.static('client/build'));


    const path = require('path');
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}


app.listen(PORT)

process.on('SIGINT', function() {  
    mongoose.connection.close(function () { 
        console.log('connection disconnected through app termination'); 
        process.exit(0); 
    }); 
});