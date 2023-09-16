const express = require("express");
const ExpressError = require("../expressError")
const router = new express.Router();
const db = require("../db");
const { listen } = require("../app");
const slugify = require("slugify");

//Get list of companies
router.get('/', async(req, res, next) => {
    try {
        const result = await db.query(`SELECT code,name FROM companies ORDER BY name`)
        return res.json({"companies": result.rows})
    } catch (err) {
        return next(err);
    }
})
//Get a company details
router.get('/:code', async(req, res, next) => {
    try {
        let {code} = req.params;
        const result = await db.query(`SELECT * FROM companies WHERE code=$1`,[code])
        if (result.rows.length === 0){
            throw new ExpressError(`${code} unable to be found `, 404)
        }
        return res.send({"company": result.rows[0]})
    } catch (err) {
        return next(err);
    }
})
//Create a new company
router.post('/', async (req, res, next) => {
    try {
        let { name, description } = req.body;
        let code = slugify(name, {lower:true});

        const result = await db.query(`INSERT INTO companies (code, name, description) VALUES ($1,$2,$3) RETURNING code, name, description`, [code, name, description]);
        
        return res.status(201).json({"company":result.rows[0]});
    } catch (err){
        return next(err);
    }
})

//Put /:code to update company
router.put('/:code', async (req, res, next) => {
    try {
        
        let { name, description } = req.body;
        let code = req.params.code;

        const result = await db.query(`UPDATE companies SET name=$1, description=$2 WHERE code=$3 RETURNING code, name, description `, [name, description, code]);
        if (result.rows.length === 0) {
            throw new ExpressError(`${code} unable to be found`, 404)
        } else {
            return res.status(201).json({"company":result.rows[0]});
        }
    } catch (err){
        return next(err);
    }
})

//Delete /:code => delete company
router.delete('/:code', async(req,res,next)=> {
    try{
        const results = db.query(`DELETE FROM companies WHERE code = $1`, [req.params.code])
        return res.send({status: "delete"})
    } catch(err){
        return next(err);
    }
})

module.exports = router;