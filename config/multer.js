
var path = require('path');
var crypto = require('crypto');
var multer = require('multer');


function fileFilter(req,file,cb){
  if(
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  
  ){
    return cb(null,true);
  }else{
    return cb(new Error(" use this type only png/jpg/jpeg "))
  }
}

const userimages = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/userimages')
  },
  filename:function (req, file, cb) {
      crypto.randomBytes(14,function(err,buff){
          var fnn=buff.toString("hex")+path.extname(file.originalname);
          cb(null,fnn);
      })
}
  
});
const productimages = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, './public/images/productimages')
    },
    filename: function (req, file, cb) {
        crypto.randomBytes(14,function(err,buff){
            var fn=buff.toString("hex")+path.extname(file.originalname);
            cb(null,fn);
        })
  }

});

module.exports={userimages,productimages,fileFilter:fileFilter}






























// const userimages = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, '../public/images/uploads/userimages')
//     },
//     filename: function (req, file, cb) {
//         var ffn = path.extname(file)
//         crypto.randomBytes(15,function(err,bfr){

//             var fn = bfr.toString('hex') + ffn.originalname ;
//         })
//       cb(null,fn)
//     }
//   })






//   const productimages = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null ,'../public/images/uploads/productimages')
//     },
//     filename: function (req, file, cb) {
//         var ffn = path.extname(file)
//         crypto.randomBytes(15,function(err,bfr){

//             var fn = bfr.toString('hex') + ffn.originalname;
//         })
//       cb(null,fn)

      
//     }
//   });
//   const userDets = multer({ storage: userimages });
//   const productDets = multer({ storage:productimages });

// module.exports = userDets;
// module.exports = productDets;

