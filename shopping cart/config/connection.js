const mongoClient=require('mongodb').MongoClient //NPM I MONGODB
const state={
    db:null
}

module.exports.connect=function(done){
    const url='mongodb://localhost:27017'
    const dbname='shopping'

    mongoClient.connect(url,(err,data)=>{
        if(err) return done(err) //IF FOUND ERROR DONE IS PASSED WITH ERR .OTHERWISE DONE()
        state.db=data.db(dbname)
        done()
    })

} //THIS IS MONGODB CONNECTION. TO RETRIVE OR GET THE CONNECTION BELOW STATEMENT AS FOLLOWS

module.exports.get=function(){
    return state.db
}
//if we call get function then we got db object eg-db,get().collection