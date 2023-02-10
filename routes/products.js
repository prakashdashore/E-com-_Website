var mongoose = require('mongoose');
var plm = require('passport-local-mongoose');
var productSchema = mongoose.Schema({
  productname:String,
  price:Number,
  productpic:{
    type:Array,
    default:[]
  },
  userid:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'user'
  },
  disc:String,
  discount:Number

});
productSchema.plugin(plm);
module.exports = mongoose.model('product',productSchema);
