// IMPORTING MODULES
const http = require('http')
const url = require('url');
const fs = require('fs');


// READING JSON FILE 
const booksData = fs.readFileSync(`${__dirname}/data/books-reviews.json`, 'utf-8');
const booksObj = JSON.parse(booksData);


//  SERVER CREATED AND ROUTES ADDED 

const server = http.createServer((req, res) => {
  const urlObj = url.parse(req.url, true);

  const pathName = urlObj.pathname;

  if (pathName === '/api/books' || pathName === '/api') {
    res.writeHead(200, {
      'Content-type': 'Application/json'
    });
    res.end(booksData)
  }
  else if (pathName === '/api/book') {
    let bookId = urlObj.query.id;
    bookId--;
    if (bookId < 0 || bookId >= booksObj.length) {
      res.writeHead(404, {
        'Content-type': 'Application/json'
      });
      const notFoundMessage = JSON.stringify({
        error: "Book you are trying to access is not available"
      })
      res.end(notFoundMessage);
    }
    else {
      res.writeHead(200, {
        'Content-type': 'Application/json'
      });
      const bookData = JSON.stringify(booksObj[bookId])
      res.end(bookData);
    }
  }
  else {
    res.writeHead(404, {
      'Content-type': 'text/html'
    });
    res.end('<div><h1>Page Not Found</h1></div><div><h2>Try using other route</h2></div><h3>The route you are trying to access is not specified</h3>');
  }
})

// SERVER SETUP
server.listen(8000, '127.0.0.1', () => {
  console.log('App Running on PORT 8000.....');
})
