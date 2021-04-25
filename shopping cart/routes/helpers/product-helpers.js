var db=require('/home/rafeeq/Desktop/Nodejs/project/shopping cart/config/connection.js')
module.exports={
    addProduct:(product,callback)=>{
        console.log(product)
        db.get().collection('product').insertOne(product).then((data)=>{
            callback(data.ops[0]._id) //id is pass for image file name
        })
    }
    
}