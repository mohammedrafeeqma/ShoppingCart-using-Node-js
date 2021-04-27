var db=require('/home/rafeeq/Desktop/Nodejs/project/shopping cart/config/connection.js')
var collection=require("/home/rafeeq/Desktop/Nodejs/project/shopping cart/config/collections.js")
var objectId=require('mongodb').ObjectID
module.exports={
    addProduct:(product,callback)=>{
        console.log(product)
        db.get().collection('product').insertOne(product).then((data)=>{
            callback(data.ops[0]._id) //id is pass for image file name
        })
    },
    //this is the promise function
    getAllProducts:()=>{
        return new Promise( async(resolve,reject)=>{
            let products=await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(products)
        })

    },
    deleteProduct:(prodId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).removeOne({_id:objectId(prodId)}).then((response)=>{
                resolve(response)
            })
        })
    }

    
}