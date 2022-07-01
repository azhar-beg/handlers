const fs = require('fs');
const mime = require('mime-types');

const determineType = (fileName) => {
  return mime.lookup(fileName);
};

const getParams = searchParams => {
  const params = {};
  for ([key, value] of searchParams.entries()) {
    params[key] = value
  }
  return params;
};

const parseParams = (req, res, next) => {
  if (req.method === 'POST') {
    let data = '';
    req.on('data', chunk => data += chunk);
    req.on('end', () => {
      req.params = getParams(new URLSearchParams(data));
      req.pathname = req.url.pathname
      console.log(req.pathname);
      next();
    })
  } else {
    const url = new URL(req.url, `http://${req.headers.host}`)
    req.pathname = url.pathname;
    req.params = getParams(url.searchParams)
    console.log(req.pathname, req.params);
    next();
  }
};

module.exports = { parseParams };


const serveStatic = (sourceRoot = './public') => function (req, res, next) {
  const fileName = req.url.pathname === '/' ? '/index.html' : req.url.pathname;
  const filePath = sourceRoot + fileName;
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath);
    res.setHeader('content-type', determineType(filePath));
    res.end(content);
    return;
  }
  next()
};

const html = content => `<html><body>${content}</body></html>`;

const notFoundHandler = function (request, response) {
  response.statusCode = 404;
  response.end(html('Bad Request'));
  return true;
};

module.exports = { notFoundHandler, serveStatic };
