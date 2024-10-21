const http = require('http');
let books = [];
let currentBookId = 1;

const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');

    // CREATE (POST): Tambahkan buku baru
    if (req.method === 'POST' && req.url === '/api/books') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const book = JSON.parse(body);
            book.book_id = currentBookId++;
            books.push(book);
            res.writeHead(201);
            res.end(JSON.stringify({
                message: 'Buku berhasil ditambahkan',
                book_id: book.book_id
            }));
        });
    }

    // READ (GET): Ambil semua buku
    else if (req.method === 'GET' && req.url === '/api/books') {
        res.writeHead(200);
        res.end(JSON.stringify(books));
    }

    // READ by ID (GET): Ambil buku berdasarkan ID
    else if (req.method === 'GET' && req.url.startsWith('/api/books/')) {
        const id = parseInt(req.url.split('/')[3]);
        const book = books.find(b => b.book_id === id);

        if (book) {
            res.writeHead(200);
            res.end(JSON.stringify(book));
        } else {
            res.writeHead(404);
            res.end(JSON.stringify({ message: 'Buku tidak ditemukan' }));
        }
    }

    // UPDATE (PUT): Perbarui buku berdasarkan ID
    else if (req.method === 'PUT' && req.url.startsWith('/api/books/')) {
        const id = parseInt(req.url.split('/')[3]);
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const updatedData = JSON.parse(body);
            let book = books.find(b => b.book_id === id);

            if (book) {
                book.title = updatedData.title;
                book.author = updatedData.author;
                book.published_year = updatedData.published_year;
                book.genre = updatedData.genre;
                book.status = updatedData.status;
                res.writeHead(200);
                res.end(JSON.stringify({ message: 'Buku berhasil diperbarui' }));
            } else {
                res.writeHead(404);
                res.end(JSON.stringify({ message: 'Buku tidak ditemukan' }));
            }
        });
    }

    // DELETE (DELETE): Hapus buku berdasarkan ID
    else if (req.method === 'DELETE' && req.url.startsWith('/api/books/')) {
        const id = parseInt(req.url.split('/')[3]);
        const bookIndex = books.findIndex(b => b.book_id === id);

        if (bookIndex !== -1) {
            books.splice(bookIndex, 1);
            res.writeHead(200);
            res.end(JSON.stringify({ message: 'Buku berhasil dihapus' }));
        } else {
            res.writeHead(404);
            res.end(JSON.stringify({ message: 'Buku tidak ditemukan' }));
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
