var mongoose = require('mongoose');
mongoose.set('strictQuery', true);
var plm = require('passport-local-mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/mydatabase').then(function(){
  console.log('conectedddddd.........!')
});

var userSchema=mongoose.Schema({
  name:String,
  username:String,
  password:Number,
  userpic:{
    type:String,
    default:""
  },
  gstin:{
    type:String,
    default:''
  },
  isseller:{type:Boolean,default:false},
  userpic:String,
  products:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'product'
  }],
  wishlist:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'product'
  }],
  address:{
    type:String,
    default:''
  },
  contect:String,
  email:String
});
userSchema.plugin(plm);
module.exports =mongoose.model('user',userSchema);
