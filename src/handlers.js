const fs = require('fs');
const mime = require('mime-types');

const determineType = (fileName) => {
  return mime.lookup(fileName);
};

const serveStatic = (sourceRoot = './public') => function (req, res) {
  const fileName = req.url.pathname === '/' ? '/index.html' : req.url.pathname;
  const filePath = sourceRoot + fileName;
  if (!fs.existsSync(filePath)) {
    return false;
  }

  const content = fs.readFileSync(filePath);
  res.setHeader('content-type', determineType(filePath));
  res.end(content);
  return true;
};

const html = content => `<html><body>${content}</body></html>`;

const notFoundHandler = function (request, response) {
  response.statusCode = 404;
  response.end(html('Bad Request'));
  return true;
};

module.exports = { notFoundHandler, serveStatic };
