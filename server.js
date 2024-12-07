const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const validCategories = ['business', 'economic', 'finances', 'politics'];

app.get('/:count/news/for/:category', async (req, res) => {
  const { count, category } = req.params;

  if (!validCategories.includes(category)) {
    return res.status(400).send('Недопустимая категория. Допустимые категории: бизнес, экономика, финансы, политика.');
  }
  if (isNaN(count) || parseInt(count) <= 0) {
    return res.status(400).send('Количество должно быть положительным целым числом.');
  }

  try {
    const rssUrl = `https://www.vedomosti.ru/rss/rubric/${category}`;
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`;

    const response = await axios.get(apiUrl);
    const articles = response.data.items.slice(0, parseInt(count));

    res.render('news', { category, count, articles });
  } catch (error) {
    console.error('Ошибка при получении новостей:', error.message);
    res.status(500).send('Ошибка при получении новостей.');
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен http://localhost:${PORT}`);
});
