var db=require('/home/rafeeq/Desktop/Nodejs/project/shopping cart/config/connection.js')
var collection=require("/home/rafeeq/Desktop/Nodejs/project/shopping cart/config/collections.js")
const bcrypt=require('bcrypt') //it is used for password encryption (npm i bcrypt)
var objectId=require('mongodb').ObjectID
const { response } = require('express')

module.exports={
    doSignup:(userData)=>{
        return new Promise( async(resolve,reject)=>{
            userData.Password=await bcrypt.hash(userData.Password,10)
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then( (data)=>{
                resolve(data.ops[0])
            })

        })
        

    },
    doLogin:(userData)=>{
        return new Promise( async(resolve,reject)=>{
            let loginStatus=false
            let response={}
             user=await db.get().collection(collection.USER_COLLECTION).findOne({Email:userData.Email})
            if(user){
                bcrypt.compare(userData.Password,user.Password).then( (status)=>{
                    if(status){
                        console.log("login success")
                        response.user=user
                        response.status=true
                        resolve(response)
                    }else{
                        console.log("login failed")
                        resolve({status:false})
                    }
                })
            }else{
                console.log("email is incorrect")
                resolve({status:false})
            }
        })
    },
    addToCart:(prodId,userId)=>{
        let proObj={
            item:objectId(prodId),
            quantity:1
        }
        return new Promise( async(resolve,reject)=>{
            console.log(prodId)
            console.log(userId)
        
            let userCart=await db.get().collection(collection.CART_COLLECTION).findOne({user:objectId(userId)})
            if(userCart){

                let proExist=userCart.products.findIndex(product=>product.item==prodId)
                if(proExist!=-1){
                    db.get().collection(collection.CART_COLLECTION)
                    .updateOne({user:objectId(userId),'products.item':objectId(prodId)},
                    {
                        $inc:{'products.$.quantity':1}
                    }
                    ).then(()=>{
                        resolve()
                    })
                }else{
                    db.get().collection(collection.CART_COLLECTION)
                    .updateOne({user:objectId(userId)},
                        {
                            
                                $push:{products:proObj}
                            
                        }
                    ).then((response)=>{
                        resolve()
                    })
                }

               
                
            }else{//if user is not in cart
                console.log("this is else part")
                let cartObj={
                    user:objectId(userId),
                    products:[proObj]
                }
                db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then((response)=>{
                    resolve()
                })
            }

        })
    },
    getCartProducts:(userId)=>{
        return new Promise( async(resolve,reject)=>{
            let cartItems=await db.get().collection(collection.CART_COLLECTION).aggregate([
                {
                $match:{user:objectId(userId)}
                },
                {
                    $unwind:'$products'
                },
                {
                    $project:{
                        item:'$products.item',
                        quantity:'$products.quantity'
                    }
                },
                {
                    $lookup:{
                        from:collection.PRODUCT_COLLECTION,
                        localField:'item',
                        foreignField:'_id',
                        as:'product'
                    }
                },
                {
                    $project:{
                    item:1,quantity:1,product:{$arrayElemAt:['$product',0]}
                    }
                }
                
            ]).toArray()
            console.log(cartItems)
            resolve(cartItems)
        })
    },
    getCartCount:(userId)=>{
        return new Promise( async(resolve,reject)=>{
            let count=0
            let cart=await db.get().collection(collection.CART_COLLECTION).findOne({user:objectId(userId)})
            if(cart){
                count=cart.products.length
            }
            resolve(count)
        })
    },
    changeProductQuantity:({details})=>{
        details.count=parseInt(details.count);
        console.log(cardId)
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.CART_COLLECTION)
                    .updateOne({_id:objectId(details.cart),'products.item':objectId(details.product)},
                    {
                        $inc:{'products.$.quantity':details.count}
                    }
                    ).then(()=>{
                        resolve()
                    })
        })

    }

}