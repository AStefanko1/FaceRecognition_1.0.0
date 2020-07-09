const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const database = {
  users: [
    {
      id : '123',
      name: 'John',
      email: 'john@email.com',
      password: 'cookies',
      entries: '0',
      joined: new Date()
    },
    {
      id : '124',
      name: 'Sally',
      email: 'sally@email.com',
      password: 'apples',
      entries: '0',
      joined: new Date()
    }
  ]
}

const app = express();

app.use(cors())
app.use(bodyParser.json());

app.get('/', (req, res)=> {
  res.send(database.users);
})

app.post('/signin', (req, res) => {
  if(req.body.email === database.users[0].email && req.body.password === database.users[0].password){
    res.json('success');
  }
  else{
    res.status(400).json('fail');
  } 

})

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  database.users.push({
    id: '125',
    name: name,
    email: email,
    password: password,
    entries: 0,
    joined: new Date()
  })  
  res.json(database.users[database.users.length - 1]);
})

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  let found = false;
  database.users.forEach(users =>{
    if(users.id === id){
      found = true;
      return res.json(user);
    }
  })
  if(!found){
    res.status(400).json('User not found');
  }
})

app.put('/image', (req, res) => {
  const { id } = req.params;
  let found = false;
  database.users.forEach(users =>{
    if(users[0].id === id){
      found = true;
      users.entries++;
      return res.json(users.entries);
    }
  })
  if(!found){
    res.status(400).json('User not found');
  }

})

app.listen(3001, ()=> {
  console.log('app is running on port 3001');
})