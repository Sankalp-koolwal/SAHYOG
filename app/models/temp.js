var mongoose = require('mongoose');


var disasterSchema = new mongoose.Schema({
    name: String, 
    image: String
});

module.exports = mongoose.model("disas", disasterSchema);