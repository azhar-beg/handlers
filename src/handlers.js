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

const injectParams = (req, res, next) => {
  if (req.method === 'POST') {
    let data = '';
    req.on('data', chunk => data += chunk);
    req.on('end', () => {
      req.body = data;
      req.bodyParams = getParams(new URLSearchParams(data));
      req.pathname = req.url.pathname
      next();
    })
  } else {
    const url = new URL(req.url, `http://${req.headers.host}`)
    req.pathname = url.pathname;
    req.searchParams = getParams(url.searchParams)
    next();
  }
};

module.exports = { injectParams };


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

const notFoundHandler = function (req, res) {
  res.statusCode = 404;
  res.end(html('Bad Request'));
  return true;
};

module.exports = { notFoundHandler, serveStatic, parseParams: injectParams };
