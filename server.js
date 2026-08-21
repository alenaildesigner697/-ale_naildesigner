require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Configuração do Multer para upload de imagens na pasta correta
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, 'public', 'assets', 'images');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'nail-' + uniqueSuffix + ext);
    }
});
const upload = multer({ storage: storage });

// Rotas da API - Serviços
app.get('/api/services', (req, res) => {
    db.all(`SELECT * FROM services`, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Rotas da API - Galeria
app.get('/api/gallery', (req, res) => {
    db.all(`SELECT * FROM gallery ORDER BY id DESC`, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Rota de Login do Admin (Simples para demonstração)
app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    db.get(`SELECT * FROM admin WHERE username = ? AND password = ?`, [username, password], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (row) {
            res.json({ success: true, message: 'Login realizado com sucesso!' });
        } else {
            res.status(401).json({ success: false, message: 'Usuário ou senha incorretos.' });
        }
    });
});

// Rota de Upload para Galeria via Painel Administrativo
app.post('/api/admin/gallery', upload.single('image'), (req, res) => {
    const { title } = req.body;
    if (!req.file) {
        return res.status(400).json({ error: 'Nenhuma imagem enviada.' });
    }
    const filename = req.file.filename;
    db.run(`INSERT INTO gallery (title, filename) VALUES (?, ?)`, [title || 'Nail Art', filename], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ success: true, id: this.lastID, filename });
    });
});

// Rota para deletar imagem da galeria
app.delete('/api/admin/gallery/:id', (req, res) => {
    const id = req.params.id;
    db.get(`SELECT filename FROM gallery WHERE id = ?`, [id], (err, row) => {
        if (row) {
            const filePath = path.join(__dirname, 'public', 'assets', 'images', row.filename);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
        db.run(`DELETE FROM gallery WHERE id = ?`, [id], (err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ success: true });
        });
    });
});

// Redirecionamento para index e admin
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor rodando com sucesso em http://localhost:${PORT} 💅✨`);
});
