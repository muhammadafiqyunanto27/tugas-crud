const http = require('http');
let orders = [];
let currentOrderId = 1;

const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');

    // CREATE (POST): Tambahkan pesanan baru
    if (req.method === 'POST' && req.url === '/api/orders') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const order = JSON.parse(body);
            order.order_id = currentOrderId++;
            orders.push(order);
            res.writeHead(201);
            res.end(JSON.stringify({
                message: 'Pesanan berhasil ditambahkan',
                order_id: order.order_id
            }));
        });
    }

    // READ (GET): Ambil semua pesanan
    else if (req.method === 'GET' && req.url === '/api/orders') {
        res.writeHead(200);
        res.end(JSON.stringify(orders));
    }

    // READ by ID (GET): Ambil pesanan berdasarkan ID
    else if (req.method === 'GET' && req.url.startsWith('/api/orders/')) {
        const id = parseInt(req.url.split('/')[3]);
        const order = orders.find(o => o.order_id === id);

        if (order) {
            res.writeHead(200);
            res.end(JSON.stringify(order));
        } else {
            res.writeHead(404);
            res.end(JSON.stringify({ message: 'Pesanan tidak ditemukan' }));
        }
    }

    // UPDATE (PUT): Perbarui pesanan berdasarkan ID
    else if (req.method === 'PUT' && req.url.startsWith('/api/orders/')) {
        const id = parseInt(req.url.split('/')[3]);
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const updatedData = JSON.parse(body);
            let order = orders.find(o => o.order_id === id);

            if (order) {
                order.quantity = updatedData.quantity;
                order.total_price = updatedData.total_price;
                order.status = updatedData.status;
                res.writeHead(200);
                res.end(JSON.stringify({ message: 'Pesanan berhasil diperbarui' }));
            } else {
                res.writeHead(404);
                res.end(JSON.stringify({ message: 'Pesanan tidak ditemukan' }));
            }
        });
    }

    // DELETE (DELETE): Hapus pesanan berdasarkan ID
    else if (req.method === 'DELETE' && req.url.startsWith('/api/orders/')) {
        const id = parseInt(req.url.split('/')[3]);
        const orderIndex = orders.findIndex(o => o.order_id === id);

        if (orderIndex !== -1) {
            orders.splice(orderIndex, 1);
            res.writeHead(200);
            res.end(JSON.stringify({ message: 'Pesanan berhasil dihapus' }));
        } else {
            res.writeHead(404);
            res.end(JSON.stringify({ message: 'Pesanan tidak ditemukan' }));
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
