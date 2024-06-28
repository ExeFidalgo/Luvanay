const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer =  require("multer")
const path = require("path");
const cors = require("cors");
const { type } = require("os");
const { log } = require("console");

app.use(express.json());
app.use(cors());

// Database Conection With MongoDB
mongoose.connect("mongodb+srv://exefidalgo:123Probando@cluster0.haw6tjx.mongodb.net/Ecommerce")

// API Creation

app.get("/", (req, res)=>{
    res.send("Express app esta corriendo")
})

// Image Storage Engine

const storage = multer.diskStorage({
    destination: './upload/images',
    filename: ( req, file, cb)=>{
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
}
});

const upload = multer({storage:storage}) 

// Creating Upload EndPoint for images
app.use('/images', express.static('upload/images'))

app.post("/upload", upload.single('product'), (req, res)=>{ 
    res.json({
        success:1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    })
})

// Schema para creacion de productos

const Product = mongoose.model("Product",{
    id: {
        type:Number,
        required: true,
    },
    name:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    new_price:{
        type:Number,
        required:true,
    },
    old_price:{
        type: Number,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now,
    },
    avilable:{
        type:Boolean,
        default:true
    },
})

app.post('/addproduct', async (req, res)=>{
    let products = await Product.find({});
    let id;
    if(products.length>0)
    {
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id+1;
    }
    else{
        id=1;
    }
    const product = new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,
    });
    console.log(product);
    await product.save();
    console.log("Saved")
    res.json({
        success:true,
        name:req.body.name,
    })
})

// Creacion de API para productos eliminados ( Creating API for deleted products)

app.post('/removeproduct', async (req, res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("Eliminado");
    res.json({
        success:true,
        name:req.body.name
    });
})

// Creating API for Getting all products ( API para obtener todos los productos)
app.get('/allproducts', async (req, res)=>{ 
    let products = await Product.find({});
    console.log("Todos los Productos Fetched");
    res.send(products);
}) 

// SCHEMA CREATING FOR USER MODEL

const Users = mongoose.model('Users', {
    name:{
        type:String
    },
    email:{
            type:String,
            unique:true,
    },
    password:{
            type:String,
    },
    cartData:{
            type:Object,
    },
    date:{
            type:Date,
            default:Date.now,
    }
})

// Creating Endpoint for Registering the User (End point de registro de Usuario)
app.post('/signup', async (req, res)=>{
    let check = await Users.findOne({email:req.body.email});
    if(check){
        return res.status(400).json({success:false, errors:"existe un usuario con el mismo Email"})
    }
    let cart = {};
    for (let i = 0; i < 300; i++) {
        cart[i] = 0;
    }
    const user = new Users({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
        cartData:cart,
    })

    await user.save();

    const data = {
        user:{
            id:user.id
        }
    }

    const token = jwt.sign(data,'secret_ecom');
    res.json({success:true, token})
})

// Creating endpoint for User Login  ( Endpoint Login de Usuario)
app.post('/login', async (req, res)=>{
    let user = await Users.findOne({email:req.body.email});
    if(user){
        const passCompare = req.body.password === user.password;
        if(passCompare){
            const data = {
                user:{
                    id:user.id
                }
            }
            const token = jwt.sign(data, 'secret_ecom');
            res.json({success:true, token});
        }
        else{
            res.json({success:false, errors:"Password Incorrecto"})
        }
    }
    else{
        res.json({success:false, errors:"Email Incorrecto"})
    }
})

// Creating endpoint for newcollection data ( Endpoint de NewCollection)
app.get('/newcollection', async (req, res)=>{
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    console.log("New Collection Fetch");
    res.send(newcollection);
})

// Creation Endpoint for Popular in Woman section (Endpoind de Popular )
app.get('/popularinwoman', async (req, res)=>{
    let products = await Product.find({category:"women"});
    let popular_in_women = products.slice(0,4);
    console.log("Popular in woman Fetched");
    res.send(popular_in_women);
})

// CReatin Middlewaare to frtvh user ( MIDDLEWARE DEL USUARIO )
const fetchUser = (req, res, next) =>{
    const token = req.header('auth-token');
    if (!token){
        res.status(401).send({errors:"Por favor Autenticate un Token Valido"})
    }
    else{
        try{
            const data = jwt.verify(token, 'secret_ecom');
            req.user = data.user;
            next();
        } catch (error){
            res.status(401).send({errors:"Por favor Autenticate con un Tokewn valido"})
        }
    }
}

//Creating Endpoint for Adding Products to CartData ( EndPoint de agregar productos al carrito)
app.post('/addtocart', fetchUser, async (req, res)=>{
    console.log("Agregado", req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id});
    userData.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate({_id:req.user.id},{ cartData:userData.cartData});
    res.send("Agregado");
})

// Creating Endpoint to Remove product from CartData (Endpoint de eliminar productos de cartData)
app.post('/removefromcart', fetchUser, async (req, res)=>{
    console.log("Eliminado", req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id});
    if(userData.cartData[req.body.itemId]>0)
    userData.cartData[req.body.itemId] -= 1;
    await Users.findOneAndUpdate({_id:req.user.id},{ cartData:userData.cartData});
    res.send("Eliminado");
})

// Creation Endpoint to get CartData ( Endpoint de Get carData )
app.post('/getcart', fetchUser, async (req, res)=>{
    console.log("GetCart");
    let userData = await Users.findOne({_id:req.user.id})
    res.json(userData.cartData);
})

app.listen(port, (error)=>{
    if(!error){
        console.log("Servidor corriendo en Puerto "+port)
    }
    else
    {
        console.log("Error : "+error)
    }
});