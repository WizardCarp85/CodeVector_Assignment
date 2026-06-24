import express from 'express';
import pool from '../db/db.js'

const router = express.Router()

router.get('/', async (req,res)=>{
    const {updated_at, id} = req.query;
    let result;

    if(!updatedAt || !id){
        const result = await pool.query(`
                SELECT * FROM products
                ORDER BY updated_at DESC, id DESC
                LIMIT 20
            `)
    }
    else{
        const result = await pool.query(`
                SELECT * FROM products
                WHERE (updated_at,id) < ($1,$2)
                ORDER BY updated_at DESC, id DESC
                LIMIT 20
            `,
            [updated_at,id]
        )
    }

    const products = result.rows

    const lastProduct = products[products.length-1];

    res.json({
        products,
        nextCursor : lastProduct ? 
                {
                    updated_at : lastProduct.updated_at,
                    id : lastProduct.id
                }
                : null
    })

});

export default router;