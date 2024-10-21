const http = require('http');
let employees = [];
let currentEmployeeId = 1;

const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');

    // CREATE (POST): Tambahkan karyawan baru
    if (req.method === 'POST' && req.url === '/api/employees') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const employee = JSON.parse(body);
            employee.employee_id = currentEmployeeId++;
            employees.push(employee);
            res.writeHead(201);
            res.end(JSON.stringify({
                message: 'Karyawan berhasil ditambahkan',
                employee_id: employee.employee_id
            }));
        });
    }

    // READ (GET): Ambil semua karyawan
    else if (req.method === 'GET' && req.url === '/api/employees') {
        res.writeHead(200);
        res.end(JSON.stringify(employees));
    }

    // READ by ID (GET): Ambil karyawan berdasarkan ID
    else if (req.method === 'GET' && req.url.startsWith('/api/employees/')) {
        const id = parseInt(req.url.split('/')[3]);
        const employee = employees.find(e => e.employee_id === id);

        if (employee) {
            res.writeHead(200);
            res.end(JSON.stringify(employee));
        } else {
            res.writeHead(404);
            res.end(JSON.stringify({ message: 'Karyawan tidak ditemukan' }));
        }
    }

    // UPDATE (PUT): Perbarui karyawan berdasarkan ID
    else if (req.method === 'PUT' && req.url.startsWith('/api/employees/')) {
        const id = parseInt(req.url.split('/')[3]);
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const updatedData = JSON.parse(body);
            let employee = employees.find(e => e.employee_id === id);

            if (employee) {
                employee.name = updatedData.name;
                employee.position = updatedData.position;
                employee.salary = updatedData.salary;
                employee.status = updatedData.status;
                res.writeHead(200);
                res.end(JSON.stringify({ message: 'Karyawan berhasil diperbarui' }));
            } else {
                res.writeHead(404);
                res.end(JSON.stringify({ message: 'Karyawan tidak ditemukan' }));
            }
        });
    }

    // DELETE (DELETE): Hapus karyawan berdasarkan ID
    else if (req.method === 'DELETE' && req.url.startsWith('/api/employees/')) {
        const id = parseInt(req.url.split('/')[3]);
        const employeeIndex = employees.findIndex(e => e.employee_id === id);

        if (employeeIndex !== -1) {
            employees.splice(employeeIndex, 1);
            res.writeHead(200);
            res.end(JSON.stringify({ message: 'Karyawan berhasil dihapus' }));
        } else {
            res.writeHead(404);
            res.end(JSON.stringify({ message: 'Karyawan tidak ditemukan' }));
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
