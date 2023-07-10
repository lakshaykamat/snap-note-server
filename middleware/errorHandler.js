// const errorHandler = (error,req,res,next)=>{
//     return res.status(400).send({message:error})    
// }
// module.exports = errorHandler
// Error handler middleware
const errorHandler = (err, req, res, next) => {
    // Log the error for debugging purposes
    console.error({err});
  
    // Set a default error status code and message
    let statusCode = 500;
    let message = 'Internal Server Error';
  
    // Customize the error response based on the type of error
    // if (err instanceof CustomError) {
    //   // Handle specific types of custom errors
    //   statusCode = err.statusCode;
    //   message = err.message;
    // } else if (err instanceof ValidationError) {
    //   // Handle validation errors
    //   statusCode = 400;
    //   message = err.message;
    // }
  
    // Send the error response to the client
    res.status(statusCode).json({ error:err });
  };
  
  module.exports = errorHandler;
  