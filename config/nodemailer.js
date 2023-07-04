const nodemailer = require("nodemailer");
const googleApis = require("googleapis");
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const CLIENT_ID = `463880634904-npjboogl7319i02s73069cf4i7q6dovb.apps.googleusercontent.com`;
const CLIENT_SECRET = `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`;
const REFRESH_TOKEN = `1//04g7dintYlZ0wCgYIARAAGAQSNwF-L9IrmWvICCemO_tLRSIzB5TqYgJRfA3LliyXsR3SUL_mc_Zfp76KQFjsa3ZGMVETdWmdAjo`;
const authClient = new googleApis.google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET,
REDIRECT_URI);
authClient.setCredentials({refresh_token: REFRESH_TOKEN});


async function mailer(userid,email,otp){
 try{
 const ACCESS_TOKEN = await authClient.getAccessToken();
 const transport = nodemailer.createTransport({
 service: "gmail",
 auth: {
 type: "OAuth2",
 user: "aniketdashore07@gmail.com",
 clientId: CLIENT_ID,
 clientSecret: CLIENT_SECRET,
 refreshToken: REFRESH_TOKEN,
 accessToken: ACCESS_TOKEN
 }
 })
 const details = {
 from:"MEMEZON - 🎇<aniketdashore07@gmail.com>",
 to:email,
 subject: "MEMEZON India Largest E-comm Website",
 text: "Padale chutiye",
 html: `<a href="http://localhost:3000/forgot/${userid}/otp/${otp}">http://localhost/${userid}/otp/${otp}</a>`
 }
 const result = await transport.sendMail(details);
 return result; 
 }
 catch(err){
 return err;
 }
}
// mailer().then(function(res){
//     console.log("MAIL SENT SUCCESSFULLYYY...", res)
// })
module.exports = mailer;
