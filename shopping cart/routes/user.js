var express = require('express');
const { response } = require('../app');
var router = express.Router();
const productHelpers = require("./helpers/product-helpers");
const userHelpers = require('./helpers/user-helpers');

/* GET home page. */
router.get('/', function(req, res, next) {
  //to add useer name in home page
  let user=req.session.user
  
  productHelpers.getAllProducts().then( (products)=>{
    console.log(user)
    res.render("user/view-products", {products,user });

  })

  
});

router.get('/login',(req,res)=>{
  res.render('user/login')
})
router.post('/login',(req,res)=>{
  userHelpers.doLogin(req.body).then( (response)=>{
    if(response.status){ 
      req.session.loggeddIn=true
      req.session.user=response.user
      res.redirect('/')
    }else{
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

  })

})

router.get('/logout',(req,res)=>{
  req.session.destroy() //to logout
  res.redirect('/')
})

module.exports = router;
