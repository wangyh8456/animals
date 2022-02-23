//id判断是否路由列表，可添加access字段
/*建表语句：
 create table menu (
     id int unsigned auto_increment,
     name varchar(100),
     status TINYINT default 1,
     sort INT default 0,
     pid varchar(100),
     level varchar(100),
     primary key(id)
);
*/
const db=require('../config/db.js');
const dbt=require('../config/dbTransaction');

module.exports = {
    create:async function(req,next){
        const dbcase=await dbt();
        try{
            const result=await dbcase.query(
                `insert into menu (name,sort,pid,level) values ('${req.name}','${req.sort||0}',${req.pid?"'"+req.pid+"'":null},'${req.level||1}')`
            ) 
            await dbcase.commit(); 
            return result;
        }catch(e){
            await dbcase.rollback();
            next(e);  
        }finally{
            await dbcase.close()
        }
    },
    findBy:async function(colname,colval,next){
        //db.js的query方法中会将异常传递给错误处理中间件，但dbtransaction.js没有，因此需要捕捉异常
        const result=await db.query(
            `select * from menu where ${colname}='${colval}'`,next
        )
        return result;
    },
    findAll:async function(data,next){
        let sql=`select * from menu where status='1'`;
        const result=await db.query(sql,next);
        return result;
    },
    count:async function(data,next){
        let sql=`select * from menu where status='1'`;
        const result=await db.query(sql,next);
        return result.length;
    },
    update:async function(data,next){
        let sql=`update menu set `;
        for(let i in data){
            if(i==='id') continue;
            sql+=`${i}='${data[i]}',`
        }
        sql=sql.substr(0,sql.length-1);
        sql+=` where id=${data.id}`;
        const result=await db.query(sql,next);
        return result;
    },
    delete:async function(data,next){
        let sql=`delete from menu where id=${data}`;
        const result=await db.query(sql,next);
        return result;
    }
}