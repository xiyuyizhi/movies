
const express =require('express')
const router= express.Router()
const TypeModel =require('../models/type_model')

router.get('/',(req,res,next)=>{
    TypeModel.getList((err,docs)=>{
        if(err){
            next(err)
            return
        }
        res.json({
            code:0,
            data:docs
        })
    })
})

module.exports=router