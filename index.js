const express = require('express');
const pa11y = require('pa11y');

const PORT = process.env.PORT || 5000;

const app = express();

app.get('/api/test', (req,res) => {
  if(!req.query.url) {
    res.status(400).json({error: 'URL is required'});
  } else {
    const results = await pa11y(req.query.url);
    res.status(200).json(results);
  }
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));