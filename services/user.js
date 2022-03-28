const model=require('../models/user')
const rolemodel=require('../models/role')
const menumodel=require('../models/menu')
var md5=require('md5-node');
var jwt = require('jsonwebtoken');

const constant=require('../config/constant');
const uploadtool=require('./upload')

const userService={
    create:async (req,res,next)=>{
        const username=await model.findBy('username',req.body.username,next);
        if(username&&username.length>0){
            return 401;
        }
        const reqdata={...req.body,password:md5(req.body.password)}
        const result=await model.create(reqdata,res,next);
        return result;
    },
    login:async (req,next)=>{
        const user=await model.findBy('username',req.body.username,next);
        if(!user||user.length<1){
            return 401;
        }
        const password=md5(req.body.password);
        if(!user[0].status){
            return 403;
        }
        if(user[0].password!==password){
            return 402;
        }
        const token = jwt.sign({username:user[0].username,id:user[0].id},constant.jwtkey,{expiresIn:constant.jwtExpireTime,algorithm:'HS256'});
        const result={...user[0],token};
        delete result.password
        return result;
    },
    find:async (req,next)=>{
        const user=await model.findAll(req.body,next);
        user.map(item=>{
            delete item.password;
            return item;
        });
        const count=await model.countUser(req.body,next);
        const result={
            list:user,
            total:count,
            pageSize:req.body.pageSize||5,
            pageNum:req.body.pageNum||1,
        }
        return result;
    },
    update:async (req,next)=>{
        const result=await model.update(req.body,next);
        return result;
    },
    changepwd:async (req,next)=>{
        const user=await model.findBy('id',req.body.id,next);
        console.log(user[0])
        const password=md5(req.body.oldpassword);
        if(user[0].password!==password){
            return 402;//原密码错误
        }
        const result=await model.update({password:md5(req.body.newpassword),id:req.body.id},next);
        return result;
    },
    delete:async (req,next)=>{
        const result=await model.delete(req.params.id,next);
        return result;
    },
    uploadAvatar:async (req,next)=>{
        const filepath=uploadtool.uploadSingle(req.file.path);
        await model.update({avatar:filepath,id:req.user.id},next);
        const user=await model.findBy('id',req.user.id,next);
        const result=user[0];
        delete result.password;
        return result;
    },
    uploadFiles:async (req,next)=>{
        const files=await uploadtool.filesUpload(req,'public/upload/multiparty/',next);
        await model.update({avatar:files[0],id:req.user.id},next);
        const user=await model.findBy('id',req.user.id,next);
        const result=user[0];
        delete result.password;
        return result;
    },
    //必须先删除角色中关联的页面权限，再删除菜单
    getRouter:async (req,next)=>{
        const user=await model.findBy('username',req.user.username,next);
        if(!user[0].roles){
            return [];
        }
        let roles=JSON.parse(user[0].roles)?JSON.parse(user[0].roles):[];
        let routes=[],pids=[];
        roles=await Promise.all(roles.map(async el=>{
            const role=await rolemodel.findBy('id',Number(el));
            return role[0]?.pageperms?role[0]?.pageperms.split(','):[];
        }))
        roles.forEach(el=>{
            routes=[...new Set([...routes,...el])];
        })
        // console.log(routes)
        await Promise.all(routes.map(async el=>{
            const menu=await menumodel.findBy('id',Number(el));
            if(Number(menu[0]?.pid))
                pids.push(menu[0].pid)
        }))
        let result=[...new Set([...routes,...pids])]
        result=result.map(el=>{
            return Number(el)
        })
        return result;
    }
}

module.exports=userService