
import app from '../src/app.js';

export default function handler(req, res) {
  app(req, res); // Vercel ejecuta Express como handler
}