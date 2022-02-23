const service=require('../services/menu')
const express = require('express');
const router = express.Router();

router.post('/create',async (req,res,next)=>{
    try{
        const result=await service.create(req,next);
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
        const result=await service.findTree(req,next);
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

router.get('/findlist',async (req,res,next)=>{
    try{
        const result=await service.findList(req,next);
        res.setjson(200,result,'查询成功！')
        return
    }catch(e){
        next(e)
    }
})

router.post('/importcsv',async (req,res,next)=>{
    try{
        const result=await service.importCSV(req,next);
        res.setjson(200,result,'导入成功！')
        return
    }catch(e){
        next(e)
    }
})

router.get('/exportcsv',async (req,res,next)=>{
    try{
        const result=await service.exportCSV(req,res,next);
        res.send(result);
        return
    }catch(e){
        next(e)
    }
})


module.exports=router