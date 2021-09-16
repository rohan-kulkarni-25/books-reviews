const http = require('http')

const server = http.createServer((req, res) => {
  res.end('OK');
})


server.listen(8000, '127.0.0.1', () => {
  console.log('App Running on PORT 8000.....');
})
