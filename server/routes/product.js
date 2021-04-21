const express = require('express');
const router = express.Router();
const fs = require('fs-js');

const { Product } = require("../models/Product");
const { User1 } = require("../models/User1");

const multer = require('multer')
const del = require('del')

var filed = "image"
const { auth } = require("../middleware/auth");

var storage = multer.diskStorage({
    destination:(req,file,cb) =>{
        cb(null, 'uploads/')
    },
    filename:(req,file,cb)=>{
        cb(null, `${file.originalname}`)
       // `${Date.now()}_${filed}`
    },
    fileFilter:(req,file,cb)=>{
        const ext = path.extname(file.originalname)
        if(ext !== '.jpg' || ext !== '.png'){
            return cb(res.status(400).end('only jpg and png type of image allowed'),false);
        }
        cb(null,true)
    }
})















var upload = multer({storage:storage}).single('file')
//var removeImage = del({storage1:storage1}).single('file')
//=================================
//             Product
//=================================

router.post("/uploadImage", auth, (req, res) => {
  //after getting that image from client we need to save in server we need 'multer library'

  upload(req,res,err=>{
      if(err) return res.json({success:false,err})
      return res.json({success:true,image:res.req.file.path,filename:res.req.file.filename})
  })
      
});

router.post("/deleteImage", auth, (req, res) => {
    //after getting that image from client we need to save in server we need 'multer library'
  console.log('pathfile',req.query.imagefile)
    //var fs = require('fs-js');
    var filePath = `${req.query.imagefile}`; 
    fs.unlinkSync(filePath);





})














router.post("/uploadProduct",auth, (req, res) => {
    //save the data got from client in to the database
    const product = new Product(req.body);
        console.log('reqbody',req.body)
    product.save((err,product)=>{
        if (err) return res.status(400).json({success:false,err})
        return res.status(200).json({success:true,product})
    })
  });

  router.post("/getProducts", (req, res) => {
    //fetch data products
   let order = req.body.order ? req.body.order : "desc";
   let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
   let limit = req.body.limit ? parseInt(req.body.limit): 100;
   let skip = parseInt(req.body.skip);

   let findArgs={};
   let turn = req.body.searchTerm;
   console.log('req.body.filters is',req.body.filters)
   console.log('termis',turn);
   for(let key in req.body.filters){
     if(req.body.filters[key].length > 0) {
         if (key === 'price'){
            findArgs[key]={
              $gte:req.body.filters[key][0],
              $lte:req.body.filters[key][1]
            }
          } else {
               findArgs[key]=req.body.filters[key];
       
       
         }
        }
  
  
    }

console.log('findArgs is',findArgs)
  
        console.log('termus',turn)
if (turn){
    Product.find(findArgs)
    .find({$text: {$search:turn}})
    .populate('write')
    .sort([[sortBy,order]])
    .skip(skip)
    .limit(limit)
    .exec((err,products)=>{
        if(err) return res.status(400).json({success:false,err})
        res.status(200).json({success:true,products,PostSize:products.length})
    })
    
} else {
    Product.find(findArgs)
    .populate('write')
    .sort([[sortBy,order]])
    .skip(skip)
    .limit(limit)
    .exec((err,products)=>{
        if(err) return res.status(400).json({success:false,err})
        res.status(200).json({success:true,products,PostSize:products.length})
    })

}
     });   
//?id=${productId}&type=single
    
   router.get("/products_by_id",auth,(req,res) => {
       let type = req.query.type
       let productIds = req.query.id
       if (type === "array"){
            let ids = req.query.id.split(',')
            productIds = []
            productIds = ids.map(item =>{
                return item
                
            })
       }
       //we need to find the product information belong to the productId
    Product.find({ '_id': { $in: productIds }})
   .populate('write')
   .exec((err,product)=>{
       if(err) return res.status(400).send(err)
       return res.status(200).send(product)
   })
    })



    router.post("/getProductsList",  (req, res) => {
        //fetch data products
       let order = req.body.order ? req.body.order : "desc";
       let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
       let limit = req.body.limit ? parseInt(req.body.limit): 100;
       let skip = parseInt(req.body.skip);
    
       let findArgs={};
       let turn = req.body.searchTerm;
       console.log('req.body.filters is',req.body.filters)
       console.log('termis',turn);
       for(let key in req.body.filters){
         if(req.body.filters[key].length > 0) {
             if (key === 'price'){
                findArgs[key]={
                  $gte:req.body.filters[key][0],
                  $lte:req.body.filters[key][1]
                }
              } else {
                   findArgs[key]=req.body.filters[key];
           
           
             }
            }
      
      
        }
    
    console.log('findArgs is',findArgs)
      
            console.log('termus',turn)
    if (turn){
        Product.find(findArgs)
        .find({$text: {$search:turn}})
        .populate('write')
        .sort([[sortBy,order]])
        .skip(skip)
        .limit(limit)
        .exec((err,products)=>{
            if(err) return res.status(400).json({success:false,err})
            res.status(200).json({success:true,products,PostSize:products.length})
        })
        
    } else {
        Product.find(findArgs)
        .populate('write')
        .sort([[sortBy,order]])
        .skip(skip)
        .limit(limit)
        .exec((err,products)=>{
            if(err) return res.status(400).json({success:false,err})
            res.status(200).json({success:true,products,PostSize:products.length})
        })
    
    }
         });   
    //?id=${productId}&type=single
    
 router.post('/deleteproduct',(req,res)=>{
    
//     Product.findOneAndDelete({_id: req.query.productId}, function (error, person){
//         //console.log("This object will get deleted " + person);
//         person.remove();

//     });
// })

     Product.findOneAndDelete({_id: req.query.productId}, 
           
        (err, productDetail)=>{
           //delete file inside uploads folder 
        productDetail.images.forEach((item)=>{
            var filePath = `${item}`; 
            fs.unlinkSync(filePath);
            // console.log('itemcollection',item)
            if(err) return res.status(400).json({success:false,err})
            res.status(200).json({success:true,productDetail})
      
        })
    
         })
        })

        router.post('/editProduct',auth,(req,res)=>{
            console.log('editproductreqbodyisimages',req.body.images)
           
            Product.findOneAndUpdate({_id: req.query.productId},
               
                { "$set": { "price": req.body.price,
                             "images": req.body.images,
                             "Prod_Cat": req.body.Prod_Cat, 
                             "write": req.body.write,
                             "title": req.body.title,
                             "description": req.body.description}})
               
              
                .exec(function(err,product){
            

                if (err) return res.status(400).json({success:false,err})
                return res.status(200).json({success:true,product})
              })
            
            }) 
            
       
    
    

    



module.exports = router;
