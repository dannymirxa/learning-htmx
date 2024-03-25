const express = require('express')
const query = require('./src/users/routes')
const pool = require("./src/users/db")
const port = 3000

const app = express();

app.use(express.static("public"))

app.use(express.urlencoded({extended: true}))

app.use(express.json())

app.get("/users", query.getAllUsers)

app.get("/users/:id", query.getUsersById)

app.put("/users/:id", query.putUsersById)

app.post("/users", query.postNewUsers)

app.delete("/users/:id", query.deleteUsersById)

app.post('/convert', (req, res) => {
    setTimeout(() => {
      const fahrenheit = parseFloat(req.body.fahrenheit);
      const celsius = (fahrenheit - 32) * (5 / 9);
  
      res.send(`
        <p>
          ${fahrenheit} degrees Farenheit is equal to ${celsius} degrees Celsius
        </p>
      `);
    }, 2000);
  });  

let counter = 0

app.get('/poll', (req, res) => {
  counter++;

  const data = {value: counter}

  res.json(data)
})

let currentTemperature = 20

app.get('/get-temperature', (req, res) => {
  currentTemperature += Math.random() * 2 -1
  res.send(currentTemperature.toFixed(1) + "°C")
})

const contacts = [
  { name: 'John Doe', email: 'john@example.com' },
  { name: 'Jane Doe', email: 'jane@example.com' },
  { name: 'Alice Smith', email: 'alice@example.com' },
  { name: 'Bob Williams', email: 'bob@example.com' },
  { name: 'Mary Harris', email: 'mary@example.com' },
  { name: 'David Mitchell', email: 'david@example.com' },
]

app.post('/search', (req, res) => {
  const searchTerm = req.body.search.toLowerCase();
  if (!searchTerm) {
    return res.send("<tr></tr>")
  }

  const searchResults = contacts.filter((contact) => {
    const name = contact.name.toLowerCase()
    const email = contact.email.toLowerCase()

    return name.includes(searchTerm) || email.includes(searchTerm)
  })

  setTimeout(() => {
    const searchResultHtml = searchResults.map(contact => `
    <tr>
      <td><div class="my-4 p-2">${contact.name}</td>
      <td><div class="my-4 p-2">${contact.email}</td>
    </tr>
    `).join("")

    res.send(searchResultHtml)
  },1000)
})

app.post('/search/api', async (req, res) => {
  const searchTerm = req.body.search.toLowerCase();

  if (!searchTerm) {
    return res.send('<tr></tr>');
  }
  const response = await fetch(`https://jsonplaceholder.typicode.com/users`);
  const contacts = await response.json();

  const searchResults = contacts.filter((contact) => {
    const name = contact.name.toLowerCase()
    const email = contact.email.toLowerCase()

    return name.includes(searchTerm) || email.includes(searchTerm)
  })

  setTimeout(() => {
    const searchResultHtml = searchResults.map(contact => `
    <tr>
      <td><div class="my-4 p-2">${contact.name}</td>
      <td><div class="my-4 p-2">${contact.email}</td>
    </tr>
    `).join("")

    res.send(searchResultHtml)
  },1000)
})

app.post('/contact/email2', async (req, res) => {
  const submittedEmail = req.body.email

  const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;

  const isValid = {
    message: 'That email is valid',
    class: 'text-green-700',
  };

  const isInvalid = {
    message: 'Please enter a valid email address',
    class: 'text-red-700',
  };

  if (!emailRegex.test(submittedEmail)) {
    return res.send(
      `
      <div class="mb-4" hx-target="this" hx-swap="outerHTML">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="email"
        >Email Address</label
      >
      <input
        name="email"
        hx-post="/contact/email"
        class="border rounded-lg py-2 px-3 w-full focus:outline-none focus:border-blue-500"
        type="email"
        id="email"
        value="${submittedEmail}"
        required
      />
      <div class="${isInvalid.class}">${isInvalid.message}</div>
    </div>
      `
    );
  } else {
    return res.send(
      `
      <div class="mb-4" hx-target="this" hx-swap="outerHTML">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="email"
        >Email Address</label
      >
      <input
        name="email"
        hx-post="/contact/email"
        class="border rounded-lg py-2 px-3 w-full focus:outline-none focus:border-blue-500"
        type="email"
        id="email"
        value="${submittedEmail}"
        required
      />
      <div class="${isValid.class}">${isValid.message}</div>
    </div>
      `
    );
  }
});

app.post('/contact/email', async (req, res) => {
  const submittedEmail = req.body.email

  let currentDate = new Date().toJSON();

  let user = req.body

  const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;

  if (user.active == 'on') {
    user.active = true
  }
  else {
    user.active = false
  }

  user.created_on = currentDate
  user.last_login = currentDate

  console.log('user:')
  console.log(user)

  const {username, password, email, age, active, created_on, last_login} = user
  try {
      await pool.query(` \
      INSERT INTO users (username, password, email, created_on, last_login, age, active) \
      VALUES \
      ('${username}', '${password}', '${email}', '${created_on}', '${last_login}', ${age}, ${active}); \
      `)

      if (!emailRegex.test(submittedEmail)) {
        return res.send(
          `
          <div class="mb-4" hx-target="this" hx-swap="outerHTML">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="email"
            >Email Address</label
          >
          <input
            name="email"
            hx-post="/contact/email"
            class="border rounded-lg py-2 px-3 w-full focus:outline-none focus:border-blue-500"
            type="email"
            id="email"
            value="${submittedEmail}"
            required
          />
          <div class="${isInvalid.class}">${isInvalid.message}</div>
        </div>
          `
        );
      } else {
        res.sendStatus(200)
      }
      //res.status(200).send({message: `'${username}', '${password}', '${email}', '${created_on}', '${last_login}', ${age}, ${active} inserted`})
  } catch (error) {
      console.log(error)
      res.sendStatus(500)
  }
});

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})