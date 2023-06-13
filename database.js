import mysql from 'mysql2'


const pool = mysql.createPool({
    host : 'localhost',
    user: "root",
    password: 'Coline11122002@',
    database: 'project'
}).promise()


export async function getAuthors() {
    const [result] = await pool.query("SELECT * FROM authors")
    return result
}

export async function getAuthor(id) {
    const [result] = await pool.query(`
    SELECT * 
    FROM authors 
    WHERE Id_Author = ?`, [id])
    return result[0]
}

export async function createAuthor(Author_Name, Author_Surname){
    const [result] = await pool.query(`INSERT INTO authors (Author_Name, Author_Surname) VALUES (?, ?)`, [Author_Name, Author_Surname])
    const id = result.insertId
    return getAuthor(id)
}
