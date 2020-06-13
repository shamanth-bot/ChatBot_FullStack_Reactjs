const mongoose = require('mongoose')
const {Schema}=mongoose;
const learnSchema=new Schema({
    ApplicationName:String,
    Issuename:String,
    IssueSolution:String 
});

mongoose.model('learnModel',learnSchema)