const pool = require("./db")

const getAllUsers = async (req, res) => {
    try {
        const data = await pool.query(`SELECT * FROM users;`)

        let table = 
            `
            <h1 class="text-2xl font-bold my-4">Users Details</h1>
            <table class="mx-auto w-1/2 border-collapse border-2 border-gray-500" style="width:100%">
                <tr class="bg-info">
                    <th class="border-2 border-gray-400"> username </th>
                    <th class="border-2 border-gray-400"> password </th>
                    <th class="border-2 border-gray-400"> email </th>
                    <th class="border-2 border-gray-400"> created_on </th>
                    <th class="border-2 border-gray-400"> last_login </th>
                    <th class="border-2 border-gray-400"> age </th>
                    <th class="border-2 border-gray-400"> active </th>
                </tr>
            `
        for (let item of data.rows) {
            table += `
            <tr class="bg-info">
                <th class="border-2 border-gray-400"> ${item.username} </th>
                <th class="border-2 border-gray-400"> ${item.password} </th>
                <th class="border-2 border-gray-400"> ${item.email} </th>
                <th class="border-2 border-gray-400"> ${item.created_on} </th>
                <th class="border-2 border-gray-400"> ${item.last_login} </th>
                <th class="border-2 border-gray-400"> ${item.age} </th>
                <th class="border-2 border-gray-400"> ${item.active} </th>
            </tr>
            `
        }
        table += '</table>';

        //res.status(200).send(data.rows)
        setTimeout(() => {
            /* res.status(200).send(
                `
                <h1 class="text-2xl font-bold my-4">UserName</h1>
                <ul>
                    ${data.rows.map((user) => `<li>${user.username}</li>`).join("")}
                </ul>
                `
            ) */


            res.status(200).send(
                table
            )
        }, 2000)
        
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}
const getUsersById = async (req, res) => {
    const id = parseInt(req.params.id)
    try {
        const data = await pool.query(`SELECT * FROM users WHERE id = ${id}
        `)
        res.status(200).send(data.rows)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

const postNewUsers = async (req, res) => {
    const {username, password, email, created_on, last_login, age, active} = req.body
    try {
        await pool.query(` \
        INSERT INTO users (username, password, email, created_on, last_login, age, active) \
        VALUES \
        ('${username}', '${password}', '${email}', '${created_on}', '${last_login}', ${age}, ${active}); \
        `)
        res.status(200).send({message: `'${username}', '${password}', '${email}', '${created_on}', '${last_login}', ${age}, ${active} inserted`})
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}




const putUsersById = async (req, res) => {
    const id = parseInt(req.params.id)
    const {username, password, email, created_on, last_login, age, active} = req.body
    try {
        await pool.query(`\
            UPDATE users SET \
                username = '${username}', \
                password = '${password}', \
                email = '${email}', \
                created_on = '${created_on}', \
                last_login = '${last_login}', \
                age = ${age}, \
                active = ${active} \
                WHERE id = ${id};`)

        const data = pool.query(`SELECT * FROM users WHERE id = ${id}`)

        res.status(200).send((await data).rows)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
};

const deleteUsersById = async (req, res) => {
    const id = parseInt(req.params.id)
    try {
        await pool.query(`DELETE FROM users WHERE id = ${id};`)
        res.status(200).send({message: `Users ${id} deleted`})
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
};


module.exports = {getAllUsers, getUsersById, putUsersById, postNewUsers, deleteUsersById}