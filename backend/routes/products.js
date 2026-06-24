import express from 'express';
import pool from '../db/db.js'

const router = express.Router()

router.get('/', async (req,res)=>{
    try{
        const {category, updated_at, id} = req.query;
        const limit = Math.min(Number(req.query.limit) || 20, 100)
        let result;

            if(!category && !updated_at && !id){
                result = await pool.query(`
                        SELECT * FROM PRODUCTS
                        ORDER BY updated_at DESC, id DESC
                        LIMIT $1
                    `,
                    [limit]
                )
            }
            else if(category && !updated_at && !id){
                result = await pool.query(`
                        SELECT * FROM PRODUCTS
                        WHERE category = $1
                        ORDER BY updated_at DESC, id DESC
                        LIMIT $2
                    `,
                    [category,limit]
                )
            }
            else if(category && updated_at && id){
                result = await pool.query(`
                        SELECT * FROM PRODUCTS
                        WHERE category = $1
                        AND (updated_at,id) < ($2,$3)
                        ORDER BY updated_at DESC, id DESC
                        LIMIT $4
                    `,
                    [category,updated_at,id,limit]
                )
            }
            else if(!category && updated_at && id){
                result = await pool.query(`
                        SELECT * FROM PRODUCTS
                        WHERE (updated_at,id) < ($1,$2)
                        ORDER BY updated_at DESC, id DESC
                        LIMIT $3
                    `,
                    [updated_at,id,limit]
                )
            }
            else{
                return res.status(400).json({
                    error : "Invalid Query Parameters"
                })
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


    }catch(err){
        console.log(err)
        return res.status(500).json({
            error: "Internal Server Error"
        })
    }
});

export default router;