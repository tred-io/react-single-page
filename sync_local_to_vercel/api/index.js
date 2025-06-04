const { createServer } = require('http');
const express = require('express');

// Import the existing server setup
async function getApp() {
  const { default: handler } = await import('../server/index.js');
  return handler;
}

module.exports = async (req, res) => {
  const handler = await getApp();
  return handler(req, res);
};
