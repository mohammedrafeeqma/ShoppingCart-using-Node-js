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
        return new Promise( async(resolve,reject)=>{
            console.log(prodId)
            console.log(userId)
        
            let userCart=await db.get().collection(collection.CART_COLLECTION).findOne({user:objectId(userId)})
            if(userCart){
                
                db.get().collection(collection.CART_COLLECTION)
                .updateOne({user:objectId(userId)},
                    {
                        
                            $push:{products:objectId(prodId)}
                        
                    }
                ).then((response)=>{
                    resolve()
                })
                console.log(products)
            }else{//if user is not in cart
                console.log("this is else part")
                let cartObj={
                    user:objectId(userId),
                    products:[objectId(prodId)]
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
                },{
                    $lookup:{
                        from:collection.PRODUCT_COLLECTION, 
                        let:{proList:'$products'},
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                        $in:['$_id',"$$proList"]
                                    }
                                }
                            }
                        ],
                        as:'cartItems'
                    }
                }
            ]).toArray()
            resolve(cartItems[0].cartItems)
        })
    }

}