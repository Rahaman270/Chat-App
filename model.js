const mangoose = require('mongoose')

const Schema = new mangoose.Schema({
    name:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    }
}, { versionKey: false })

module.exports = mangoose.model('All Messages',Schema)