require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Data (hardcoded stories, exact categories)
let stories = [
  {id:1, title:"कॉलेज गर्ल की प्यासी चूत- 1", excerpt:"यंग Xx गर्ल कहानी में ...", content:"यहाँ पूरी कहानी लिखो...", date:"2025-12-02", categories:["जवान लड़की"], tags:["Hindi Adult Stories"], thumbnail:"https://i.imgur.com/0wK1g0J.jpeg", views:5421},
  {id:2, title:"भाभी की चुदाई - 1", excerpt:"भाभी देवर की कहानी...", content:"यहाँ पूरी कहानी लिखो...", date:"2025-12-01", categories:["भाभी की चुदाई"], tags:["Bhabhi"], thumbnail:"https://i.imgur.com/9pL5mM8.jpeg", views:3876},
  {id:3, title:"पड़ोसी की लड़की", excerpt:"पड़ोसी के साथ रोमांस...", content:"यहाँ पूरी कहानी लिखो...", date:"2025-11-30", categories:["पड़ोसी"], tags:["Padosi"], thumbnail:"https://i.imgur.com/Xample3.jpeg", views:2891}
  // Add more as needed
];

let subscribers = []; // {name, email, phone, upi, address}
let donors = []; // {upi, amount, message, date}

// Auth
let isAuthenticated = false;

// Routes
app.get('/', (req, res) => {
  const latest = stories.slice(0, 10); // Latest 10
  res.render('index', {stories: latest, allStories: stories});
});

app.get('/category/:slug', (req, res) => {
  const slug = req.params.slug;
  const catStories = stories.filter(s => s.categories.includes(slug.replace('-', ' '))); // Map slug to category name
  res.render('category', {category: slug, stories: catStories});
});

app.get('/story/:id', (req, res) => {
  const story = stories.find(s => s.id == req.params.id);
  if (!story) return res.status(404).send('Not found');
  story.views++;
  res.render('story', {story});
});

app.get('/search', (req, res) => {
  const q = req.query.q || '';
  const results = stories.filter(s => s.title.toLowerCase().includes(q.toLowerCase()) || s.excerpt.toLowerCase().includes(q.toLowerCase()));
  res.render('search', {query: q, results});
});

app.get('/admin', (req, res) => {
  if (isAuthenticated) {
    res.render('admin', {stories, subscribers, donors, msg: ""});
  } else {
    res.render('admin-login', {msg: ""});
  }
});

app.post('/admin/login', (req, res) => {
  if (req.body.pass === "DesiKahani@786") {
    isAuthenticated = true;
    res.redirect('/admin');
  } else {
    res.render('admin-login', {msg: "❌ Galat password!"});
  }
});

app.post('/admin/add-story', (req, res) => {
  if (!isAuthenticated) return res.redirect('/admin');
  const newStory = {
    id: stories.length + 1,
    title: req.body.title,
    excerpt: req.body.excerpt,
    content: req.body.content,
    date: new Date().toISOString().split('T')[0],
    categories: Array.isArray(req.body.categories) ? req.body.categories : [req.body.categories],
    tags: req.body.tags ? req.body.tags.split(',') : [],
    thumbnail: req.body.thumbnail || "https://i.imgur.com/0wK1g0J.jpeg",
    views: 0
  };
  stories.push(newStory);
  res.render('admin', {stories, subscribers, donors, msg: "Story added!"});
});

app.post('/subscribe', (req, res) => {
  subscribers.push({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    upi: req.body.upi,
    address: req.body.address
  });
  res.render('subscribe-success', {email: req.body.email});
});

app.post('/donate', (req, res) => {
  donors.push({
    upi: req.body.upi,
    amount: req.body.amount,
    message: req.body.message,
    date: new Date().toISOString().split('T')[0]
  });
  res.render('donate-success');
});

app.get('/admin/logout', (req, res) => {
  isAuthenticated = false;
  res.redirect('/');
});

app.listen(process.env.PORT || 3000, () => console.log('Server running on port 3000'));
