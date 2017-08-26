
const express = require('express')
const router = express.Router()
const CONFIG = require('../config/config')
const TypeModel = require('../models/type_model')

router.get('/', (req, res, next) => {
    TypeModel.getList((err, docs) => {
        if (err) {
            next(err)
            return
        }
        res.json({
            code: CONFIG.ERR_OK,
            data: docs
        })
    })
})

module.exports = router