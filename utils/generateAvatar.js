const gravatar = require('gravatar');

exports.generateAvatar = (email)=> {
    // Generate a random email address (for demo purposes) if none is provided
  
    // Generate a Gravatar URL for the provided email
    const gravatarUrl = gravatar.url(email, { s: '200', r: 'pg', d: 'identicon' });
  console.log(gravatarUrl)
    return "https:" + gravatarUrl;
}