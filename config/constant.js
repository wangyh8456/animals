//403 token错误

module.exports={
    jwtkey:'jjjwt_8456',
    jwtExpireTime:60*60*24*7,
    redisTokenExpireTime:60*30,
    whiteList:['/user/login'],
    logFile:'./logs',
    logLevel:process.env.NODE_ENV==='development'?'debug':'info',
    logPrefix:'ms_core',
    port:8890,
    timezone:'Asia/Shanghai',//moment-timezone时区
    promotions:[
        {id:1,name:'create'},
        {id:2,name:'view'},
        {id:3,name:'update'},
        {id:4,name:'delete'},
        {id:5,name:'upload'}
    ]
}   