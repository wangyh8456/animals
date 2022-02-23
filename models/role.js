/*建表语句：
 create table role (
     id int unsigned auto_increment,
     name varchar(100),
     status TINYINT default 1,
     pageperms text,
     nozzleperms text,
     primary key(id)
);
*/
const db=require('../config/db.js');
const dbt=require('../config/dbTransaction');

module.exports = {
    create:async function(req,res,next){
        const dbcase=await dbt();
        try{
            const result=await dbcase.query(
                `insert into role (name) values ('${req.name}')`
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
            `select * from role where ${colname}='${colval}'`,next
        )
        return result;
    },
    findAll:async function(data,next){
        const pageNum=data.pageNum?data.pageNum:1;
        const pageSize=data.pageSize?data.pageSize:5;
        const name=data.name?data.name:'';
        const start=(pageNum-1)*pageSize;
        let sql=`select * from role where name like '%${name}%'`;
        if(data.status||data.status===0){
            sql+=` and status='${data.status}'`;
        }
        sql+=` limit ${start},${pageSize}`;
        const result=await db.query(sql,next);
        return result;
    },
    exportlist:async function(data,next){
        let sql=`select * from role where status=1`;
        const result=await db.query(sql,next);
        return result;
    },
    count:async function(data,next){
        const name=data.name?data.name:'';
        let sql=`select count(*) as count from role where name like '%${name}%'`;
        if(data.status||data.status===0){
            sql+=` and status='${data.status}'`;
        }
        const result=await db.query(sql,next);
        return result[0].count;
    },
    update:async function(data,next){
        let sql=`update role set `;
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
        let sql=`delete from role where id=${data}`;
        const result=await db.query(sql,next);
        return result;
    }
}