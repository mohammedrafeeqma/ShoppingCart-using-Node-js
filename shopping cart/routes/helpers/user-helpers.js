var db=require('/home/rafeeq/Desktop/Nodejs/project/shopping cart/config/connection.js')
var collection=require("/home/rafeeq/Desktop/Nodejs/project/shopping cart/config/collections.js")
const bcrypt=require('bcrypt') //it is used for password encryption (npm i bcrypt)

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
    }

}