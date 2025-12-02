require('dotenv').config();
const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Data
let stories = [
  {id:1, title:"कॉलेज गर्ल की प्यासी चूत- 1", excerpt:"यंग Xx गर्ल कहानी में मैं कॉलेज में पढ़ने वाली सेक्सी गर्म माल हूँ...", content:"यहाँ पूरी कहानी लिखो...", date:"2025-12-02", categories:["जवान लड़की"], tags:["Hindi Adult Stories", "अंग प्रदर्शन"], thumbnail:"https://i.imgur.com/0wK1g0J.jpeg", views:5421},
  {id:2, title:"भाभी की चुदाई - 1", excerpt:"भाभी देवर की कहानी...", content:"यहाँ पूरी कहानी लिखो...", date:"2025-12-01", categories:["भाभी की चुदाई"], tags:["Bhabhi"], thumbnail:"https://i.imgur.com/9pL5mM8.jpeg", views:3876},
  {id:3, title:"पड़ोसी की लड़की", excerpt:"पड़ोसी के साथ रोमांस...", content:"यहाँ पूरी कहानी लिखो...", date:"2025-11-30", categories:["पड़ोसी"], tags:["Padosi"], thumbnail:"https://i.imgur.com/Xample3.jpeg", views:2891},
  {id:4, title:"रिश्तों में चुदाई", excerpt:"परिवारिक रिश्तों की कहानी...", content:"यहाँ पूरी कहानी लिखो...", date:"2025-11-29", categories:["रिश्तों में चुदाई"], tags:["Family"], thumbnail:"https://i.imgur.com/0wK1g0J.jpeg", views:2000},
  {id:5, title:"कोई मिल गया", excerpt:"अजनबी से मिलन...", content:"यहाँ पूरी कहानी लिखो...", date:"2025-11-28", categories:["कोई मिल गया"], tags:["Stranger"], thumbnail:"https://i.imgur.com/9pL5mM8.jpeg", views:1500}
  // Add more for pagination test
];

let subscribers = []; // {name, email, phone, upi, address}
let donors = []; // {upi, amount, message, date}

// Auth
let isAuthenticated = false;

// Helper for pagination
function paginate(items, page = 1, perPage = 10) {
  const offset = (page - 1) * perPage;
  return { data: items.slice(offset, offset + perPage), totalPages: Math.ceil(items.length / perPage), currentPage: page };
}

// Routes
app.get('/', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const paginated = paginate(stories, page);
  res.render('index', {stories: paginated.data, currentPage: paginated.currentPage, totalPages: paginated.totalPages, allStories: stories});
});

app.get('/category/:slug', (req, res) => {
  const slug = req.params.slug.replace(/-/g, ' ');
  const catStories = stories.filter(s => s.categories.some(c => c === slug));
  const page = parseInt(req.query.page) || 1;
  const paginated = paginate(catStories, page);
  res.render('category', {category: slug, stories: paginated.data, currentPage: paginated.currentPage, totalPages: paginated.totalPages});
});

app.get('/story/:id', (req, res) => {
  const story = stories.find(s => s.id == req.params.id);
  if (!story) return res.status(404).send('Not found');
  story.views++;
  res.render('story', {story});
});

app.get('/search', (req, res) => {
  const q = req.query.q || '';
  const results = stories.filter(s => 
    s.title.toLowerCase().includes(q.toLowerCase()) || s.excerpt.toLowerCase().includes(q.toLowerCase())
  );
  const page = parseInt(req.query.page) || 1;
  const paginated = paginate(results, page);
  res.render('search', {query: q, stories: paginated.data, currentPage: paginated.currentPage, totalPages: paginated.totalPages});
});

app.get('/subscribe', (req, res) => res.render('subscribe', {}));
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
    tags: req.body.tags ? req.body.tags.split(',').map(t => t.trim()) : [],
    thumbnail: req.body.thumbnail || "https://i.imgur.com/0wK1g0J.jpeg",
    views: 0
  };
  stories.push(newStory);
  res.render('admin', {stories, subscribers, donors, msg: "Story added successfully!"});
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
