const model=require('../models/menu');
const uploadtool=require('./upload');

const findAllChildById=(menuList,source)=>{
    let theresult=[],theids=[];
    menuList.forEach(el=>{
        if(Number(el.pid)===source.id){
            let {result,ids}=findAllChildById(menuList,el);
            if(result?.length>0){
                el.children=[...result].sort((a,b)=>a.sort-b.sort);
            }
            theids=[...new Set([...theids,...ids,el.id])];
            theresult.push(el);
        }
    });
    return {result:theresult,ids:[...theids,source.id]};
}

const menuService={
    create:async (req,next)=>{
        const result=await model.create(req.body,next);
        return result;
    },
    findTree:async (req,next)=>{
        const menu=await model.findAll(req.body,next);
        const tree=menu.map(item=>{
            if(item.level==='1'){
                const templist=findAllChildById(menu,item).result;
                if(templist?.length>0){
                    item.children=[...templist].sort((a,b)=>a.sort-b.sort);
                }
            }
            return item;
        });
        return tree.filter(el=>el.level==='1').sort((a,b)=>a.sort-b.sort);
    },
    update:async (req,next)=>{
        const result=await model.update(req.body,next);
        return result;
    },
    delete:async (req,next)=>{
        const parent=await model.findBy('id',req.params.id,next);
        const menu=await model.findAll(req.body,next);
        const ids=findAllChildById(menu,parent[0]).ids;
        ids.forEach(async el=>{
            await model.delete(el,next);
        })
        return true;
    },
    findList:async (req,next)=>{
        const menu=await model.findAll(req.body,next);
        return menu;
    },
    importCSV:async (req,next)=>{
        const files=await uploadtool.uploadWithoutHttp(req,'public/excel/',next);
        const csvList=await uploadtool.parseCSV(files[0],req,next);
        await Promise.all(csvList.map(async el=>{
            await model.create(el,next);
        }))
        return csvList;
    },
    exportCSV:async (req,res,next)=>{
        res.set({
            'Content-Type': 'application/vnd.ms-excel',
            'Content-Disposition': 'attachment;filename=moban.csv',
            'Pragma':'no-cache',
            'Cache-Control': 'No-cache',
            'Expires': 0 //缓存页立即过期
        })
        let dataList=[{name:'test1',sort:'0',pid:'',level:1}]
        content = '路由名称,排序,父级ID,层级\n'
        content+= dataList.map((item, index) => {
            return item.name +','+ item.sort +','+ item.pid +','+ item.level  +'\n'
        }).join('')
     
        let buffer = new Buffer(content,'utf8')
        return buffer;
    },
}

module.exports=menuService