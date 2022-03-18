const {DbError}=require('../error/error')
const {ERROR_CODE}=require('../error/error_code')

var mysql = require("mysql")
var pool = mysql.createPool({
    // host:"123.56.85.203",
    host:"localhost",
    user:"root",
    password:"root",
    database:"shopmall"
})//数据库连接池配置

// function query(sql,callback){
//     pool.getConnection(function(err,connection){
//         connection.query(sql, function (err,rows) {
//             callback(err,rows)
//             connection.release()
//         })
//     })
// }//对数据库进行增删改查操作的基础
module.exports={
    query:function(sql,next,values,callback){
        return new Promise(( resolve, reject ) => {
            pool.getConnection(function(err, connection) {
                if (err) {
                    next( new DbError({message:'db connect exist error!',code:ERROR_CODE.INTERNAL_SERVER_ERROR}) )
                } 
                else{
                    connection.query(sql, values, ( err, rows) => {
                        if ( err ) {
                            console.log(err.message)
                            next( new DbError({message:'db.query exist error!',code:ERROR_CODE.INTERNAL_SERVER_ERROR}) )
                        } 
                        else{
                            resolve( rows )
                        }
                        // 结束会话
                        connection.release()
                    })
                }
            })
        })
    }
}