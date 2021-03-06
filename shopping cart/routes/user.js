var express = require('express');
const { response } = require('../app');
var router = express.Router();
const productHelpers = require("./helpers/product-helpers");
const userHelpers = require('./helpers/user-helpers');

/* GET home page. */
// verify user is login
const verifyLogin=(req,res,next)=>{
  if(req.session.loggeddIn){
    next()
  }else{
    res.redirect('/login')
  }
}

router.get('/', async function(req, res, next) {
  //to add useer name in home page
  let user=req.session.user
  let cartCount=null
  if(req.session.user){
  cartCount= await userHelpers.getCartCount(req.session.user._id,)
  }
  
  productHelpers.getAllProducts().then( (products)=>{
    res.render("user/view-products", {products,user,cartCount });

  })

  
});


router.get('/login',(req,res)=>{
  if(req.session.loggeddIn){
    res.redirect('/')
  }
  else{
  res.render('user/login',{"loginErr":req.session.loginErr})
  req.session.loginErr=false
  }
})
router.post('/login',(req,res)=>{
  userHelpers.doLogin(req.body).then( (response)=>{
    if(response.status){ 
      req.session.loggeddIn=true
      req.session.user=response.user
      res.redirect('/')
    }else{
      req.session.loginErr=true
      res.redirect('/login')
    }

  })
})

router.get('/signup',(req,res)=>{
  res.render('user/signup')
})
router.post('/signup',(req,res)=>{

  userHelpers.doSignup(req.body).then( (response)=>{
    console.log(response)
    req.session.loggeddIn=true
    req.session.user=response.user
    res.redirect('/')

  })

})

router.get('/logout',(req,res)=>{
  req.session.destroy() //to logout
  res.redirect('/')
})
router.get('/cart',verifyLogin,async(req,res)=>{
  let products= await userHelpers.getCartProducts(req.session.user._id)
  console.log(products)
  res.render('user/cart',{products,user:req.session.user})
  
})
router.get('/add-to-cart/:id',verifyLogin,(req,res)=>{
  userHelpers.addToCart(req.params.id,req.session.user._id).then(()=>{
    res.json({status:true})
  })
})
router.post('/change-product-quantity',(req,res,next)=>{
  
  
  userHelpers.changeProductQuantity(req.body).then(()=>{
    console.log(req.body)
    
  })
})



module.exports = router;
