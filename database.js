const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbFile = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbFile, (err) => {
    if (err) {
        console.error('Erro ao abrir o banco de dados', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
        initTables();
    }
});

function initTables() {
    db.run(`CREATE TABLE IF NOT EXISTS services (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        price TEXT NOT NULL,
        image TEXT NOT NULL
    )`, (err) => {
        if (!err) {
            // Inserir dados padrão se a tabela estiver vazia
            db.get(`SELECT COUNT(*) as count FROM services`, (err, row) => {
                if (row.count === 0) {
                    const defaultServices = [
                        ['Alongamento em Gel', 'Alongamento resistente, natural e com alta durabilidade.', 'R$ 120,00', '/assets/images/servico-gel.jpg'],
                        ['Banho de Gel', 'Proteção e fortalecimento para unhas naturais.', 'R$ 80,00', '/assets/images/servico-banho.jpg'],
                        ['Manicure', 'Cuidado completo com cutículas, lixamento e esmaltação tradicional.', 'R$ 45,00', '/assets/images/servico-manicure.jpg'],
                        ['Pedicure', 'Cuidado relaxante e detalhado para os pés.', 'R$ 50,00', '/assets/images/servico-pedicure.jpg'],
                        ['Esmaltação em Gel', 'Brilho intenso e durabilidade de até 21 dias sem descascar.', 'R$ 70,00', '/assets/images/servico-esmaltacao.jpg'],
                        ['Nail Art', 'Designs exclusivos, encapsuladas, francesinha reversa e pedrarias.', 'A partir de R$ 30,00', '/assets/images/servico-nailart.jpg'],
                        ['Manutenção', 'Manutenção periódica para garantir a beleza e integridade do alongamento.', 'R$ 90,00', '/assets/images/servico-manutencao.jpg']
                    ];
                    const stmt = db.prepare(`INSERT INTO services (name, description, price, image) VALUES (?, ?, ?, ?)`);
                    defaultServices.forEach(s => stmt.run(s));
                    stmt.finalize();
                }
            });
        }
    });

    db.run(`CREATE TABLE IF NOT EXISTS gallery (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        filename TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (!err) {
            db.get(`SELECT COUNT(*) as count FROM gallery`, (err, row) => {
                if (row.count === 0) {
                    const defaultGallery = [
                        ['Unhas de Gel Nude Elegante', 'galeria-1.jpg'],
                        ['Francesinha Delicada', 'galeria-2.jpg'],
                        ['Nail Art Minimalista ✨', 'galeria-3.jpg'],
                        ['Glitter Rosé Gold Glam', 'galeria-4.jpg'],
                        ['Baby Boomer Perfeita', 'galeria-5.jpg'],
                        ['Esmaltação Vermelho Clássico', 'galeria-6.jpg']
                    ];
                    const stmt = db.prepare(`INSERT INTO gallery (title, filename) VALUES (?, ?)`);
                    defaultGallery.forEach(g => stmt.run(g));
                    stmt.finalize();
                }
            });
        }
    });

    db.run(`CREATE TABLE IF NOT EXISTS admin (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )`, (err) => {
        if (!err) {
            db.get(`SELECT COUNT(*) as count FROM admin`, (err, row) => {
                if (row.count === 0) {
                    // Senha padrão inicial: admin123
                    db.run(`INSERT INTO admin (username, password) VALUES ('ale', 'admin123')`);
                }
            });
        }
    });
}

module.exports = db;
