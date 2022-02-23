const model=require('../models/role')

const roleService={
    create:async (req,res,next)=>{
        const role=await model.findBy('name',req.body.name,next);
        if(role&&role.length>0){ //角色名重复
            return 401;
        }
        const result=await model.create(req.body,res,next);
        return result;
    },
    find:async (req,next)=>{
        const role=await model.findAll(req.body,next);
        role.map(item=>{
            delete item.password;
            return item;
        });
        const count=await model.count(req.body,next);
        const result={
            list:role,
            total:count,
            pageSize:req.body.pageSize||5,
            pageNum:req.body.pageNum||1
        }
        return result;
    },
    update:async (req,next)=>{
        const result=await model.update(req.body,next);
        return result;
    },
    delete:async (req,next)=>{
        const result=await model.delete(req.params.id,next);
        return result;
    },
    exportlist:async (req,next)=>{
        const result=await model.exportlist(next);
        return result;
    },
}

module.exports=roleService