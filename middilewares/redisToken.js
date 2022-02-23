const constant=require('../config/constant');
const {TokenError}=require('../error/error')
const {ERROR_CODE}=require('../error/error_code')

module.exports = (req,res, next) => {
    let time=Math.round(Date.now()/1000);
    const path=req.path;
    try{
        if(path==='/user/login'){
            redisClient.hset('token',req.body.username,time+constant.redisTokenExpireTime,err=>{})
            return next();
        }
        if(constant.whiteList.indexOf(path)<0){
            redisClient.hget('token',req.user.username,(err,val)=>{
                if(!val||val<time){
                    return next(new TokenError({message:'Token Timeout!',code:ERROR_CODE.UNAUTHORIZED}));  //回调函数，return只return到回调函数
                }else{
                    redisClient.hset('token',req.user.username,time+constant.redisTokenExpireTime,err=>{});
                    return next();
                }
            });        
        }
    }catch(e){
        next(new TokenError({message:'Invalid Token!',code:ERROR_CODE.UNAUTHORIZED}));
    }
}