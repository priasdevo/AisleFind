let news = [
    { id: "1", title: "Note 1", body: "Content 1", postImage: "Post image 1" },
    { id: "2", title: "Note 2", body: "Content 2 test", postImage: "Post image 2" },
  ];
  
const getAllNews = (_, callback) => {
callback(null, { news: news });
};

const getNews = (_, callback) => {
const newsId = _.request.id;
const newsItem = news.find(({ id }) => newsId == id);
callback(null, newsItem);
};

const addNews = (call, callback) => {
const _news = { id: Date.now(), ...call.request };
news.push(_news);
callback(null, _news);
};

const editNews = (_, callback) => {
const newsId = _.request.id;
const newsItem = news.find(({ id }) => newsId == id);
newsItem.body = _.request.body;
newsItem.postImage = _.request.postImage;
newsItem.title = _.request.title;
callback(null, newsItem);
};

const deleteNews = (_, callback) => {
const newsId = _.request.id;
news = news.filter(({ id }) => id !== newsId);
callback(null, {});
};

module.exports = {
    getAllNews,
    getNews,
    addNews,
    editNews,
    deleteNews
};
  