require('dotenv').config();
const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

let stories = [
  {id:1, title:"कॉलेज गर्ल की प्यासी चूत- 1", excerpt:"यंग Xx गर्ल कहानी में मैं कॉलेज में पढ़ने वाली सेक्सी गर्म माल हूँ...", content:"पूरी कहानी यहाँ लिखें...", date:"2025-12-02", categories:["जवान लड़की"], tags:["Hindi Adult Stories", "अंग प्रदर्शन"], thumbnail:"https://i.imgur.com/0wK1g0J.jpeg", views:5421},
  {id:2, title:"भाभी की चुदाई - 1", excerpt:"भाभी देवर की कहानी...", content:"पूरी कहानी यहाँ लिखें...", date:"2025-12-01", categories:["भाभी की चुदाई"], tags:["Bhabhi"], thumbnail:"https://i.imgur.com/9pL5mM8.jpeg", views:3876},
  {id:3, title:"पड़ोसी की लड़की", excerpt:"पड़ोसी के साथ रोमांस...", content:"पूरी कहानी यहाँ लिखें...", date:"2025-11-30", categories:["पड़ोसी"], tags:["Padosi"], thumbnail:"https://i.imgur.com/Xample3.jpeg", views:2891}
];

let subscribers = [];
let donors = [];
let isAuthenticated = false;

function paginate(items, page = 1, perPage = 10) {
  const offset = (page - 1) * perPage;
  return { 
    data: items.slice(offset, offset + perPage), 
    totalPages: Math.ceil(items.length / perPage), 
    currentPage: page 
  };
}

// Routes (same jaise pehle the – sirf admin password env se)
app.get('/', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const paginated = paginate(stories, page);
  res.render('index', {stories: paginated.data, currentPage: paginated.currentPage, totalPages: paginated.totalPages});
});

// Baaki sab routes same rahenge… (category, story, search, admin, subscribe, donate etc.)
// (tu ne pehle wale code mein rakhe hain na? agar nahi toh bol main poora server.js ek baar mein bhej doonga)

// Admin login
app.post('/admin/login', (req, res) => {
  if (req.body.pass === (process.env.ADMIN_PASS || "DesiKahani@786")) {
    isAuthenticated = true;
    res.redirect('/admin');
  } else {
    res.render('admin-login', {msg: "Galat password!"});
  }
});

app.get('/admin/logout', (req, res) => {
  isAuthenticated = false;
  res.redirect('/');
});

// ←←← SABSE LAST MEIN YEH HONA CHAHIYE →→→
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server successfully started on port ${PORT}`);
});
