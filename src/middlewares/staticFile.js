import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default function setupStaticFiles(app) {
    // Middleware para archivos estáticos
    app.use(express.static(path.join(__dirname, '..', '../views')));
    app.use(express.static(path.join(__dirname, '..', '../public')));


}