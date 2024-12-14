let googleNewsAPI = require("google-news-json");
googleNewsAPI.getNews(googleNewsAPI.SEARCH, "apple", "en-GB", (err, response) => {
    console.log(response);
});