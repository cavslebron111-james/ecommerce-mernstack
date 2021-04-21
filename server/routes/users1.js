const express = require('express');
const router = express.Router();
const { User1 } = require("../models/User1");
const {Product} = require("../models/Product");
const {Payment} = require("../models/Payment");
const async = require('async');
const multer = require('multer')


const { auth } = require("../middleware/auth");

//=================================
//             User
//=================================

router.get("/auth", auth, (req, res) => {
    res.status(200).json({
        _id: req.user1._id,
        isAdmin: req.user1.role === 0 ? false : true,
        isAuth: true,
        email: req.user1.email,
        name: req.user1.name,
        lastname: req.user1.lastname,
        role: req.user1.role,
        image: req.user1.image,
        cart:req.user1.cart,
        history:req.user1.history
    });
});


///////////////////////////////////////////////////////

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

router.post("/userImg", auth, (req, res) => {
    //after getting that image from client we need to save in server we need 'multer library'
  
    upload(req,res,err=>{
        User1.findOneAndUpdate({_id:req.query.imgId},
            { "$set": { "image": res.req.file.path}})
             .exec(function(err,user){
           
            
        
        
        if(err) return res.json({success:false,err})
        return res.json({success:true,image:res.req.file.path,filename:res.req.file.filename,user})
   
    })
})   
  });






router.post("/register", (req, res) => {

   
    const user1 = new User1(req.body);
    user1.save((err, doc) => {
        if (err) return res.json({ success: false, msg:"sorry that email was taken already try another one"});
        return res.status(200).json({
            success: true
        });
    });
});


//////////////////////////////////////////


router.post("/login", (req, res) => {
    User1.findOne({ email: req.body.email }, (err, user1) => {
        if (!user1)
            return res.json({
                loginSuccess: false,
                message: "Auth failed, email not found"
            });

        user1.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "Wrong password" });

            user1.generateToken((err, user1) => {
                if (err) return res.status(400).send(err);
                res.cookie("w_authExp", user1.tokenExp);
                res
                    .cookie("w_auth", user1.token)
                    .status(200)
                    .json({
                        loginSuccess: true, userId: user1._id
                    });
            });
        });
    });
});


//////////////////////////////////////////////////////////


router.get("/logout", auth, (req, res) => {
    User1.findOneAndUpdate({ _id: req.user1._id }, { token: "", tokenExp: "" }, (err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        });
    });
});

//////////////////////////////////////////////////////


router.post("/addToCart", auth, (req, res) => {
    User1.findOne({ _id:req.user1._id},(err,userInfo)=>{
            let duplicate = false;
            console.log('userinfo',userInfo)
            console.log('requestid',req.user1._id)
            
            userInfo.cart.find((item)=>{
                
                if(item.id == req.query.productId){
                duplicate = true;
              
            }
        })
             
           if (duplicate){
               User1.findOneAndUpdate(
                   { _id:req.user1._id, "cart.id":req.query.productId},
                    {$inc: {"cart.$.quantity": 1 }},
                    {new:true},
                    (err,userInfo)=>{
                        if(err) return res.json({success:false,err});
                        res.status(200).json(userInfo.cart)

                        }
               )
                    } else {
                        User1.findOneAndUpdate(
                            {_id:req.user1._id},
                            {
                                $push:{
                                    cart:{
                                        id:req.query.productId,
                                        quantity:1,
                                        date:Date.now()
                                    }
                                }
                            },
                            {new:true},
                            (err,userInfo)=>{
                                if(err) return res.json({success:false,err});
                                res.status(200).json(userInfo.cart)
                            }
                            
                        )
                    
           }
        })
    })



/////////////////////////////////////////////////////////////////////////


   router.get('/removeFromCart',auth,(req,res)=>{
       User1.findOneAndUpdate(
           {_id:req.user1._id},
           {
               "$pull":
                  {"cart": {"id":req.query._id}}
               },
               {new:true},
               (err,userInfo)=>{
                   let cart = userInfo.cart;
                   let array = cart.map(item =>{
                       return item.id
                   })
               Product.find({"_id": { $in: array}})
               .populate('write')
               .exec((err,cartDetail)=>{
                   return res.status(200).json({
                       cartDetail,cart
                   })
               })
               
                }
           
       )
   })

/////////////////////////////////////////////////////////////////////////


   router.get('/userCartInfo',auth,(req,res)=>{
       User1.findOne(
           {_id:req.user1._id},
           (err,userInfo)=>{
               let cart = userInfo.cart
               let array = cart.map(item=>{
                   return item.id
               })
           

           Product.find({'_id': {$in: array}})
           .populate('write')
           .exec((err,cartDetail)=>{
               if(err) return res.status(400).send(err);
               return res.status(200).json({success:true,cartDetail,cart})
           })
        })
   })


           router.post('/successBuy',auth,(req,res)=>{
               let history = [];
               let transactionData = {};

               // put brief payment information inside user collection
            req.body.cartDetail.forEach((item)=>{
                history.push({
                  dateofPurchase:Date(),
                  name:item.title,
                  id:item._id,
                  price:item.price,
                  quantity:item.quantity,
                //  paymentId:req.body.paymentData.paymentID
                  paymentId: req.body.paymentData.paymentID
                })
            })
          
          
          
               // put payment information that come from paypal to payment collection
                 transactionData.user = {
                  id:req.user1._id,
                  name:req.user1.name,
                  lastname:req.user1.lastname,
                  email:req.user1.email
                 }
          
                 transactionData.data = req.body.paymentData;
                 transactionData.product = history;
             
                User1.findOneAndUpdate({
                       _id:req.user1._id},
                       {$push:{history:history},$set: {cart:[]}},
                       {new:true},
                       (err,user1)=>{
                           if(err) return res.json({success:false,err})
                      
                           const payment = new Payment(transactionData)
                               payment.save((err,doc)=>{
                                if(err) return res.json({success:false,err})
                      
                              // increase the amount of sold numbers for the sold information
                         //first we need to know how many products were sold in this transaction
                         // for each of the products
                            let products = [];
                            doc.product.forEach(item =>{
                               products.push({id:item.id,quantity:item.quantity })
                        })
                      
                        async.eachSeries(products,(item,callback)=>{
                            Product.update(
                                {_id:item.id},
                                {
                                    $inc:
                                    {'sold':item.quantity}
                                },
                                {new:false},
                                callback
                            )
                        }, (err) => {
                            if(err) return res.json({success:false,err})
                            res.status(200).json({
                                success:true,
                               cart:user1.cart,
                                cartDetail:[]
                            })
                        })




                        })
             
             
                    })
             
                 
            })


            ////////////////////////////////////////////////////////////////////////////


            router.get('/getHistory',auth,(req,res)=>{
                User1.findOne(
                    {_id:req.user1._id},
                    (err,doc)=>{
                        let history = doc.history;
                        if(err) return res.status(400).send(err)
                        return res.status(200).json({success:true,history})
                    }
                )
            })


            //////////////////////////////////////////////////////////////////////////////

            router.post("/addCart", auth, (req, res) => {
                User1.findOne({ _id:req.user1._id},(err,userInfo)=>{
                    let duplicate = false;
                    console.log('userinfocheck',userInfo)
                    console.log('requestid',req.user1._id)
                    
                    userInfo.cart.forEach((item)=>{
                        
                        if(item.id === req.query.productId){
                        duplicate = true;
                      
                    }
                })
                  
                   if (duplicate){
                       User1.findOneAndUpdate(
                           { _id:req.user1._id, "cart.id":req.query.productId},
                            {$inc: {"cart.$.quantity": 1 }},
                            {new:true},
                            (err,userInfo)=>{
                                if(err) return res.json({success:false,err});
                                res.status(200).json(userInfo.cart)
        
                                }
                       )
                            } else {
                                User1.findOneAndUpdate(
                                    {_id:req.user1._id},
                                    {
                                        $push:{
                                            cart:{
                                                id:req.query.productId,
                                                quantity:1,
                                                date:Date.now()
                                            }
                                        }
                                    },
                                    {new:true},
                                    (err,userInfo)=>{
                                        if(err) return res.json({success:false,err});
                                        res.status(200).json(userInfo.cart)
                                    }
                                    
                                )
                            
                   }
                })
            })

//////////////////////////////////////////////////////////////////////////////


router.post("/subtractCart", auth, (req, res) => {
    User1.findOne({ _id:req.user1._id},(err,userInfo)=>{
        let zeroStatus = false;
        console.log('userinfocheck',userInfo)
        console.log('requestid',req.user1._id)
        
        userInfo.cart.forEach((item)=>{
            
            if(item.id === req.query.productId && item.quantity > 1){
            zeroStatus = true
        }
      }) 
       console.log('zeroStatus',zeroStatus)
       if (zeroStatus){
           User1.findOneAndUpdate(
               { _id:req.user1._id, "cart.id":req.query.productId},
                {$inc: {"cart.$.quantity": -1 }},
                {new:true},
                (err,userInfo)=>{
                    if(err) return res.json({success:false,err});
                    res.status(200).json(userInfo.cart)

                    }
                  )
               }
               


   })
})

//    router.post('/userImg',auth,(req,res)=>{
//          User1.findOneAndUpdate({_id:req.query.imgId},
//             { "$set": { "image": req.body.formData}})
//              .exec(function(err,user){
            

//                 if (err) return res.status(400).json({success:false,err})
//                 return res.status(200).json({success:true,user})
//               })
            
            
            
            
//    })


        
module.exports = router;
