const express = require("express");
const axios = require("axios");
const app = express();
const port = 8080;
app.get("/numbers", async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Enter URL" });
  }
  const urls = Array.isArray(url) ? url : [url];

  try {
    const responses = await Promise.all(urls.map((u) => axios.get(u)));

    const numbers = responses.reduce((val, response) => {
      if (response && response.data && Array.isArray(response.data.numbers)) {
        val.push(...response.data.numbers);
      }
      return val;
    }, []);

    const uniqueSortedNumbers = Array.from(new Set(numbers)).sort((a, b) => a - b);

    res.json({ numbers: uniqueSortedNumbers });
  } catch (error) {
    res.status(500).json({ error: "Error fetching numbers from the provided URLs." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
