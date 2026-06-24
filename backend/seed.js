// This files contains the script to seed the database with 200,000 products
import pool from './db/db.js'

let categories = ['Electronics','Books','Sports','Clothing','Furniture','Toys']

const start = Date.now()

async function seed(){
    const TOTAL_PRODUCTS = 200000;
    const BATCH_SIZE = 5000;

    for(let batch=0; batch<TOTAL_PRODUCTS; batch += BATCH_SIZE){
        const products = []

        for(let i=1; i<=5000; i++){
            products.push({
                name : `Product ${batch+i}`,
                category : categories[(Math.floor(Math.random()*categories.length))],
                price : Math.floor(Math.random()*1000)+1
            })
        }


        const placeholders = []
        const values = []

        products.forEach((product,index)=>{
            const createdAt = new Date(
                Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
            )

            const updated_at = new Date(
                createdAt.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000
            )

            const offset = index*5

            placeholders.push(
                `($${offset+1},$${offset+2},$${offset+3},$${offset+4},$${offset+5})`
            )

            values.push(
                product.name,
                product.category,
                product.price,
                createdAt,
                updated_at
            )
        })

        const query = `
            INSERT INTO products
                (name,category,price,created_at,updated_at)
            VALUES
                ${placeholders.join(',')}
        `;

        await pool.query(query,values)
    }

    console.log(`Completed in ${(Date.now()-start)/1000}s`);

    await pool.end();
}

seed().catch(console.error)