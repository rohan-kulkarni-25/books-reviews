// IMPORT REQUIRED MODULES

const http = require('http')
const url = require('url');
const fs = require('fs');
const dotenv = require('dotenv');
const { hostname } = require('os');

// READING JSON FILE 
const booksData = fs.readFileSync(`${__dirname}/data/books-reviews.json`, 'utf-8');
const booksObj = JSON.parse(booksData);

// READING TEMPLATE FILES
const tempBookshelf = fs.readFileSync(`${__dirname}/templates/template-bookshelf.html`, 'utf-8')
const tempBookReview = fs.readFileSync(`${__dirname}/templates/template-book-review.html`, 'utf-8')
const tempBookCard = fs.readFileSync(`${__dirname}/templates/template-book.html`, 'utf-8')
const tempReviewCard = fs.readFileSync(`${__dirname}/templates/template-review.html`, 'utf-8')
const tempBookInReviewCard = fs.readFileSync(`${__dirname}/templates/template-book-in-review.html`, 'utf-8')


// Replace Module 
// REPLACING PAGE 1 CONTENT 
const templateCreator = (temp, data) => {
  let bookCards = '';
  data.forEach(element => {
    let elementCard = temp.replace(/{%BOOKNAME%}/g, element.name);
    elementCard = elementCard.replace(/{%BOOKNAME%}/g, element.name);
    elementCard = elementCard.replace(/{%AUTHOR%}/g, element.author)
    elementCard = elementCard.replace(/{%PRICE%}/g, element.price)
    elementCard = elementCard.replace(/{%ID%}/g, element.id)
    bookCards = bookCards.concat(elementCard);
  });
  return bookCards;
}

// REPLACING REVIEW PAGE CONTENT 
const templateReviewCreator = (temp, data) => {
  let elementCard = temp.replace(/{%BOOKNAME%}/g, data.name);
  elementCard = elementCard.replace(/{%BOOKNAME%}/g, data.name);
  elementCard = elementCard.replace(/{%AUTHOR%}/g, data.author)
  elementCard = elementCard.replace(/{%PRICE%}/g, data.price)
  elementCard = elementCard.replace(/{%ID%}/g, data.id)
  return elementCard;
}

// REPLACING REVIEW CARDS 
const templateReviewGenerator = (temp, data) => {
  let reviewCards = '';
  const dataObj = (data.reviews[0]).reader;
  dataObj.forEach(reader => {
    let Card = temp.replace(/{%REVIEW_NAME%}/g, reader.name);
    Card = Card.replace(/{%REVIEW_COMMENT%}/g, reader.review);
    reviewCards = reviewCards.concat(Card);
  })
  return reviewCards;
}

//  SERVER CREATED AND ROUTES ADDED 

const server = http.createServer((req, res) => {
  const urlObj = url.parse(req.url, true);
  const pathName = urlObj.pathname;

  // ROTUES START 

  // BASIC ROUTE ENTRY POINT 
  if (pathName === '/' || pathName === '/books') {
    res.writeHead(200, {
      'Content-type': 'text/html'
    })
    let output = templateCreator(tempBookCard, booksObj)
    let outputPage = tempBookshelf.replace('{%BOOKS%}', output)
    res.end(outputPage);
  }

  // SPECIFIC BOOK ROUTE WHEN CLICKED ON READ REVIEW
  else if (pathName === '/book/') {
    let bookId = urlObj.query.id;
    bookId--;
    res.writeHead(200, {
      'Content-type': 'text/html'
    })
    let output = templateReviewCreator(tempBookInReviewCard, booksObj[bookId]);
    let outputPage = tempBookReview.replace('{%BOOK_CARD%}', output)
    let reviews = templateReviewGenerator(tempReviewCard, booksObj[bookId]);
    console.log(reviews);
    outputPage = outputPage.replace(/{%ALL_REVIEWS%}/g, reviews);
    res.end(outputPage);
  }

  // API ALL BOOKS LIST ROUTE 
  else if (pathName === '/api/books' || pathName === '/api') {
    res.writeHead(200, {
      'Content-type': 'Application/json'
    });
    res.end(booksData)
  }

  // API SINGLE BOOK LIST ROUTE CAN GIVE ROUTE WITH HELP OF  PASSING ID IN QUERY 
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

  // ERROR CATCHING ROUTE 
  else {
    res.writeHead(404, {
      'Content-type': 'text/html'
    });
    res.end('<div><h1>Page Not Found</h1></div><div><h2>Try using other route</h2></div><h3>The route you are trying to access is not specified</h3>');
  }
})

// SERVER SETUP

const port = process.env.PORT || 8000;

server.listen(port, hostname, () => {
  console.log(`App Running on PORT ${port}.....`);
})
