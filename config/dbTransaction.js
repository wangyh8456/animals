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

class MysqlModel {
    /**
     * 实例化mysql
     */
    getConnection() {
        return new Promise((resolve, reject) => {
            pool.getConnection(function (err, connection) {
                if (err) {
                    reject(err);
                } else {
                   console.log(60, 'mysql连接成功')
                    resolve([
                        connection,
                        pool
                    ]);
                }
            })
        })
    }
 
}
 
async function mysqlDBUtil() {
    try {
        const db = new MysqlModel();
        const [conn, pool] = await db.getConnection();
        /**
         * 回滚事务
         */
        const rollback = async function () {
            conn.rollback();
            console.log('mysql事务发生回滚......rollback')
        }
 
        /**
         * 数据库操作
         * @param {} sql
         * @param {*} options
         */
        const query = function (sql, options) {
            return new Promise((resolve, reject) => {
                conn.beginTransaction();
                conn.query(sql, options, function (error, results, fields) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results);
                    }
                })
            })
        }
 
        /**
         *提交事务
         */
        const commit = function () {
            return new Promise((resolve, reject) => {
                conn.commit(function (err) {
                    if (err) {
                        reject(err);
                    }else{
                        console.log('mysql事务提交......commit')
                        resolve(true);
                    }
                });
            })
        }
        /**
         * 关闭连接池，mysql2的包自己不会释放
         */
        const close = async function () {
            conn.release();
            console.log('mysql连接池释放.....release');
        }
        return {
            rollback,
            commit,
            close,
            query
        }
    } catch (error) {
        throw new DbError({message:'dbtransaction exist error!',code:ERROR_CODE.INTERNAL_SERVER_ERROR});
    }
}
module.exports = mysqlDBUtil;