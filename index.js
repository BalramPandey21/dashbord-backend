const express = require("express");
const multer=require("multer")
const cors = require("cors");
const jwt=require("jsonwebtoken")
require('./db/config.js');
const User = require("./db/user");
const Product = require("./db/product");
const app = express();
const jwtKey="Pinnacle";
app.use(express.json());
app.use(cors()); //to resolve cors error
app.post("/register", async (req, res) => {
  let user = new User(req.body);
  let result = await user.save();
  result = result.toObject();
  delete result.password;
  // res.send(result);
  jwt.sign({result},jwtKey,{expiresIn:"2h"},(err,token)=>{
    if(err){
      res.send({message:"Error Found "})
    }
    res.send({result,auth:token})
  })
});

app.post("/login", async (req, res) => {
  if (req.body.email && req.body.password) {
    let user = await User.findOne(req.body).select("-password");
    if(user){
      jwt.sign({user},jwtKey,{expiresIn:"2h"},(err,token)=>{
        if(err){
          res.send({message:"Error Found "})
        }
        res.send({user,auth:token})
      })

    // res.send(user);

    } else {
      res.send({ message: "No user Found on that Id" });
    }
  } else {
    res.send({ message: " No user Found on that Id" });
  }
});

app.post("/add-product", async (req, res) => {
  let product = new Product(req.body);
  let result = await product.save();
  res.send(result);
});

app.get("/product", async (req, res) => {
  try {
    const product = await Product.find();
    // res.status(200).json(product);
    if (product.length >0){
      res.send(product);
    } else {
      res.send({result: " There is no any Products in Products List"});
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
app.delete('/product/:id',async(req,res)=>{
  const result= await Product.deleteOne({_id:req.params.id});
  res.send(result); 
});
app.get('/product/:id',async(req,res)=>{

  const result=await Product.findOne({_id:req.params.id});
  if(result){
    res.send(result)
  }
  else{
    res.send({message: "No Product Found"})
  }
  
})

app.put('/product/:id',async(req,res)=>{
  let result=await Product.updateOne({_id:req.params.id},{$set:req.body});
  res.send(result);
})

app.get('/search/:key',async(req,res)=>{
  let result=await Product.find({
    "$or":[
      {name:{$regex:req.params.key.toUpperCase()}},
      {name:{$regex:req.params.key.toLowerCase()}},
      {name:{$regex:req.params.key}},
      {category:{$regex:req.params.key.toUpperCase()}},
      {category:{$regex:req.params.key.toLowerCase()}},
      {category:{$regex:req.params.key}}
    ]
  });
  res.send(result);
})

const upload=multer({
  storage:multer.diskStorage({destination:function(req,filename,cb) {
  cb(null,"upload")
  },
  filename:function(req,file,cb){
    cb(null,file.filename +"-"+Date.now()+".jpg")
  }
  })
}).single("user");
  app.post("/upload",(req,res)=>{
  res.send('File Uploaded')
})

app.listen(6000);
console.log("server is running on 6000");
