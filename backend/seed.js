// This files contains the script to seed the database with 200,000 products
import pool from './db/db.js'

let categories = ['Electronics','Books','Sports']

async function seed(){

    await pool.query(`
        INSERT INTO products
            (name,category,price,created_at,updated_at)
        VALUES
            ('Product1','Electronics',700,NOW(),NOW()),
            ('Product2','Sports',200,NOW(),NOW()),
            ('Product3','Electronics',500,NOW(),NOW()),
            ('Product4','Sports',800,NOW(),NOW()),
            ('Product5','Electronics',400,NOW(),NOW()),
            ('Product6','Books',600,NOW(),NOW()),
            ('Product7','Books',500,NOW(),NOW()),
            ('Product8','Sports',900,NOW(),NOW()),
            ('Product9','Electronics',400,NOW(),NOW()),
            ('Product10','Books',200,NOW(),NOW())
        `)
    console.log("Inserted 10 products")
    await pool.end();
}

seed().catch(console.error)