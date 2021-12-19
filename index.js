import express from 'express';
import pa11y from 'pa11y';
import cors from 'cors';
import morgan from 'morgan';
import chalk from 'chalk';

const app = express();

if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

app.use(cors());

app.get('/api/test', async (req, res) => {
  try {
    if(!req.query.url) {
      return res.status(400).json({error: 'URL is required'});
      // return res.status(400).send('URL is required');
    }

    const results = await pa11y(req.query.url);
    
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({error: error.message});
    // res.status(500).send('Server Error');
  }
});

// Set static folder
app.use(express.static('public'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(chalk.yellow(`Server is running on port ${PORT}!`))
});