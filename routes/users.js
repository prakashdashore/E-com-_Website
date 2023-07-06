var mongoose = require('mongoose');
mongoose.set('strictQuery', true);
var plm = require('passport-local-mongoose');
mongoose
.connect('mongodb+srv://e-comm:xK757yWBMw6CsyQF@cluster0.kjjbllg.mongodb.net/').then(function(){
  console.log('Connected to db ')


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
  otp:{
    type:String,
    default:''
  },
  contect:String,
  
  email:String
});
userSchema.plugin(plm);
module.exports =mongoose.model('user',userSchema);
