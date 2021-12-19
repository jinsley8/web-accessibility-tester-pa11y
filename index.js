import express from 'express';
import pa11y from 'pa11y';
import cors from 'cors';
import morgan from 'morgan';
import chalk from 'chalk';
import puppeteer from 'puppeteer';

const app = express();

if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

app.use(cors());

app.get('/api/test', async (req, res) => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();

  try {
    if(!req.query.url) {
      return res.status(400).json({error: 'URL is required'});
      // return res.status(400).send('URL is required');
    }

    const results = await pa11y(req.query.url, {
      runners: [
        'axe',
        'htmlcs'
      ],
      browser: browser,
      page,
    });
    
    res.status(200).json(results);

    // Close the browser instance and pages now we're done with it
	  await page.close();
		await browser.close();

  } catch (error) {
    // Close the browser instance and pages if theys exist
		if (page) {
			await page.close();
		}
		if (browser) {
			await browser.close();
		}

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