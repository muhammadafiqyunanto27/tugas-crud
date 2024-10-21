const http = require('http');
let users = [];
let currentId = 1;

const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');

    // CREATE (POST): Tambahkan pengguna baru
    if (req.method === 'POST' && req.url === '/api/users') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const user = JSON.parse(body);
            user.user_id = currentId++;
            users.push(user);
            res.writeHead(201);
            res.end(JSON.stringify({
                message: 'Pengguna berhasil ditambahkan',
                user_id: user.user_id
            }));
        });
    }

    // READ (GET): Ambil semua pengguna
    else if (req.method === 'GET' && req.url === '/api/users') {
        res.writeHead(200);
        res.end(JSON.stringify(users));
    }

    // READ by ID (GET): Ambil pengguna berdasarkan ID
    else if (req.method === 'GET' && req.url.startsWith('/api/users/')) {
        const id = parseInt(req.url.split('/')[3]);
        const user = users.find(u => u.user_id === id);

        if (user) {
            res.writeHead(200);
            res.end(JSON.stringify(user));
        } else {
            res.writeHead(404);
            res.end(JSON.stringify({ message: 'Pengguna tidak ditemukan' }));
        }
    }

    // UPDATE (PUT): Perbarui pengguna berdasarkan ID
    else if (req.method === 'PUT' && req.url.startsWith('/api/users/')) {
        const id = parseInt(req.url.split('/')[3]);
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const updatedData = JSON.parse(body);
            let user = users.find(u => u.user_id === id);

            if (user) {
                user.name = updatedData.name;
                user.email = updatedData.email;
                user.phone = updatedData.phone;
                user.role = updatedData.role;
                user.status = updatedData.status;
                res.writeHead(200);
                res.end(JSON.stringify({ message: 'Pengguna berhasil diperbarui' }));
            } else {
                res.writeHead(404);
                res.end(JSON.stringify({ message: 'Pengguna tidak ditemukan' }));
            }
        });
    }

    // DELETE (DELETE): Hapus pengguna berdasarkan ID
    else if (req.method === 'DELETE' && req.url.startsWith('/api/users/')) {
        const id = parseInt(req.url.split('/')[3]);
        const userIndex = users.findIndex(u => u.user_id === id);

        if (userIndex !== -1) {
            users.splice(userIndex, 1);
            res.writeHead(200);
            res.end(JSON.stringify({ message: 'Pengguna berhasil dihapus' }));
        } else {
            res.writeHead(404);
            res.end(JSON.stringify({ message: 'Pengguna tidak ditemukan' }));
        }
    }

    // Jika route tidak ditemukan
    else {
        res.writeHead(404);
        res.end(JSON.stringify({ message: 'Route tidak ditemukan' }));
    }
});

server.listen(3000, () => {
    console.log('Server running on port http://localhost:3000/');
});
