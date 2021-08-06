var mongoose = require("mongoose");

//urlSchema
var urlSchema = mongoose.Schema({

    
      url: {
        type: String,
        required: true,
      },
      redurl: {
        type: String,
      },
})
module.exports = mongoose.model("Url", urlSchema);


