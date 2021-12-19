const express = require('express');
const pa11y = require('pa11y');

const app = express();

app.get('/api/test', async (req, res) => {

  if(!req.query.url) {
    res.status(400).json({error: 'URL is required'});
  }

  try {
    const results = await pa11y(req.query.url);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});

// Set static folder
app.use(express.static('public'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));