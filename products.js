const http = require('http');
let products = [];
let currentId = 1;

const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');

    // CREATE (POST): Tambahkan produk baru
    if (req.method === 'POST' && req.url === '/api/products') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const product = JSON.parse(body);
            product.product_id = currentId++;
            products.push(product);
            res.writeHead(201);
            res.end(JSON.stringify({
                message: 'Produk berhasil ditambahkan',
                product_id: product.product_id
            }));
        });
    }

    // READ (GET): Ambil semua produk
    else if (req.method === 'GET' && req.url === '/api/products') {
        res.writeHead(200);
        res.end(JSON.stringify(products));
    }

    // READ by ID (GET): Ambil produk berdasarkan ID
    else if (req.method === 'GET' && req.url.startsWith('/api/products/')) {
        const id = parseInt(req.url.split('/')[3]);
        const product = products.find(p => p.product_id === id);

        if (product) {
            res.writeHead(200);
            res.end(JSON.stringify(product));
        } else {
            res.writeHead(404);
            res.end(JSON.stringify({ message: 'Produk tidak ditemukan' }));
        }
    }

    // UPDATE (PUT): Perbarui produk berdasarkan ID
    else if (req.method === 'PUT' && req.url.startsWith('/api/products/')) {
        const id = parseInt(req.url.split('/')[3]);
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const updatedData = JSON.parse(body);
            let product = products.find(p => p.product_id === id);

            if (product) {
                product.name = updatedData.name;
                product.price = updatedData.price;
                product.stock = updatedData.stock;
                product.description = updatedData.description;
                product.category = updatedData.category;
                res.writeHead(200);
                res.end(JSON.stringify({ message: 'Produk berhasil diperbarui' }));
            } else {
                res.writeHead(404);
                res.end(JSON.stringify({ message: 'Produk tidak ditemukan' }));
            }
        });
    }

    // DELETE (DELETE): Hapus produk berdasarkan ID
    else if (req.method === 'DELETE' && req.url.startsWith('/api/products/')) {
        const id = parseInt(req.url.split('/')[3]);
        const productIndex = products.findIndex(p => p.product_id === id);

        if (productIndex !== -1) {
            products.splice(productIndex, 1);
            res.writeHead(200);
            res.end(JSON.stringify({ message: 'Produk berhasil dihapus' }));
        } else {
            res.writeHead(404);
            res.end(JSON.stringify({ message: 'Produk tidak ditemukan' }));
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
