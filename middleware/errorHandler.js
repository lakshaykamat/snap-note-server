const errorHandler = (error,req,res,next)=>{
    return res.status(400).send({message:error})    
}
module.exports = errorHandler