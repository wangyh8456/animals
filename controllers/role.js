const service=require('../services/role')
const express = require('express');
const router = express.Router();

router.post('/create',async (req,res,next)=>{
    try{
        const result=await service.create(req,res,next);
        if(result===401){
            res.setjson(401,'该角色名已存在!');
            return
        }
        if(result){
            res.setjson(200,result,'创建成功！')
            return
        }
    }catch(e){
        next(e);
    }
});

router.post('/update',async (req,res,next)=>{
    try{
        const result=await service.update(req,next);
        res.setjson(200,result,'修改成功！')
        return
    }catch(e){
        next(e)
    }
})

router.post('/find',async (req,res,next)=>{
    try{
        const result=await service.find(req,next);
        res.setjson(200,result,'查询成功！')
        return
    }catch(e){
        next(e)
    }
})

router.post('/delete/:id',async (req,res,next)=>{
    try{
        const result=await service.delete(req,next);
        res.setjson(200,result,'删除成功！')
        return
    }catch(e){
        next(e)
    }
})

router.get('/exportlist',async (req,res,next)=>{
    try{
        const result=await service.exportlist(req,next);
        res.setjson(200,result,'查询成功！')
        return
    }catch(e){
        next(e)
    }
})

module.exports=router