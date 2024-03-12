const express = require('express');
require('dotenv').config();
const { Configuration, OpenAIApi } = require('openai');

const app = express();
const port = 3000;

const apiKey = process.env.OPENAI_KEY;