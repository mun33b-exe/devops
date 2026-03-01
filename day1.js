// Simple authentication API with in-memory user storage
const users = new Map();

// Helper function to parse JSON body
function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            try {
                resolve(JSON.parse(body));
            } catch (e) {
                reject(e);
            }
        });
    });
}

// Authentication middleware
async function handleAuth(req, res) {
    if (req.url === '/auth/register' && req.method === 'POST') {
        try {
            const { username, password } = await parseBody(req);
            
            if (!username || !password) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Username and password required' }));
                return true;
            }
            
            if (users.has(username)) {
                res.statusCode = 409;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'User already exists' }));
                return true;
            }
            
            users.set(username, { password, createdAt: Date.now() });
            res.statusCode = 201;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: 'User registered successfully', username }));
            return true;
        } catch (e) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Invalid JSON' }));
            return true;
        }
    }
    
    if (req.url === '/auth/login' && req.method === 'POST') {
        try {
            const { username, password } = await parseBody(req);
            
            const user = users.get(username);
            if (!user || user.password !== password) {
                res.statusCode = 401;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Invalid credentials' }));
                return true;
            }
            
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: 'Login successful', username }));
            return true;
        } catch (e) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Invalid JSON' }));
            return true;
        }
    }
    
    return false;
}


const http = require('http');
http.createServer((req, res)=>{
    if (req.url=='/' && req.method=="GET") {
        res.end("This is / url");
    }
    else if (req.url=='/health' && req.method=="GET") {
        res.end("This is /health url");
    }
    // else if{
    //     console.log(res.statusCode=404)
    //     console.log(req.method)
    //     console.log(req.url)
    //     res.end("Error : Not Found")
    // }
    else if (req.url=='/about' && req.method=="GET") {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ name: 'Muhammad Muneeb Rehman', role: 'Developer' }));
        }
        else if (req.url=='/api/data' && req.method=="GET") {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'API data', timestamp: Date.now() }));
        }
        else if (req.url=='/html' && req.method=="GET") {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end('<h1>Welcome</h1><p>This is HTML response</p>');
        }
        else if (req.url=='/redirect' && req.method=="GET") {
        res.statusCode = 302;
        res.setHeader('Location', '/');
        res.end();
        }
}).listen(8080);



// Login module integration
http.createServer(async (req, res) => {
    // Try authentication routes first
    const authHandled = await handleAuth(req, res);
    if (authHandled) return;
    
    // Existing routes
    if (req.url === '/' && req.method === "GET") {
        res.end("This is / url");
    }
    else if (req.url === '/health' && req.method === "GET") {
        res.end("This is /health url");
    }
    else if (req.url === '/about' && req.method === "GET") {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ name: 'Muhammad Muneeb Rehman', role: 'Developer' }));
    }
    else if (req.url === '/api/data' && req.method === "GET") {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'API data', timestamp: Date.now() }));
    }
    else if (req.url === '/html' && req.method === "GET") {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end('<h1>Welcome</h1><p>This is HTML response</p>');
    }
    else if (req.url === '/redirect' && req.method === "GET") {
        res.statusCode = 302;
        res.setHeader('Location', '/');
        res.end();
    }
    else {
        res.statusCode = 404;
        res.end("Error: Not Found");
    }
}).listen(8080, () => {
    console.log('Server running on port 8080');
    console.log('Authentication endpoints available:');
    console.log('- POST /auth/register');
    console.log('- POST /auth/login');
});


// Logout module
const sessions = new Map(); // Store active sessions

// Generate simple session token
function generateToken(username) {
    return Buffer.from(`${username}:${Date.now()}:${Math.random()}`).toString('base64');
}

// Modified login to create session
async function handleAuthWithSession(req, res) {
    if (req.url === '/auth/login' && req.method === 'POST') {
        try {
            const { username, password } = await parseBody(req);
            
            const user = users.get(username);
            if (!user || user.password !== password) {
                res.statusCode = 401;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Invalid credentials' }));
                return true;
            }
            
            const token = generateToken(username);
            sessions.set(token, { username, loginTime: Date.now() });
            
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: 'Login successful', username, token }));
            return true;
        } catch (e) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Invalid JSON' }));
            return true;
        }
    }
    
    if (req.url === '/auth/logout' && req.method === 'POST') {
        try {
            const { token } = await parseBody(req);
            
            if (!token) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Token required' }));
                return true;
            }
            
            if (!sessions.has(token)) {
                res.statusCode = 401;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Invalid or expired token' }));
                return true;
            }
            
            const session = sessions.get(token);
            sessions.delete(token);
            
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: 'Logout successful', username: session.username }));
            return true;
        } catch (e) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Invalid JSON' }));
            return true;
        }
    }
    
    return false;
}


// Delete account module
async function handleDeleteAccount(req, res) {
    if (req.url === '/auth/delete' && req.method === 'DELETE') {
        try {
            const { username, password, token } = await parseBody(req);
            
            if (!username || !password) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Username and password required' }));
                return true;
            }
            
            const user = users.get(username);
            if (!user) {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'User not found' }));
                return true;
            }
            
            if (user.password !== password) {
                res.statusCode = 401;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Invalid credentials' }));
                return true;
            }
            
            // Delete user
            users.delete(username);
            
            // Delete all sessions for this user
            if (token) {
                sessions.delete(token);
            }
            for (const [sessionToken, session] of sessions.entries()) {
                if (session.username === username) {
                    sessions.delete(sessionToken);
                }
            }
            
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: 'Account deleted successfully', username }));
            return true;
        } catch (e) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Invalid JSON' }));
            return true;
        }
    }
    
    return false;
}


// Edit account module
async function handleEditAccount(req, res) {
    if (req.url === '/auth/edit' && req.method === 'PUT') {
        try {
            const { username, currentPassword, newPassword, token } = await parseBody(req);
            
            if (!username || !currentPassword) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Username and current password required' }));
                return true;
            }
            
            const user = users.get(username);
            if (!user) {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'User not found' }));
                return true;
            }
            
            if (user.password !== currentPassword) {
                res.statusCode = 401;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Invalid credentials' }));
                return true;
            }
            
            if (!newPassword || newPassword.length < 1) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'New password required' }));
                return true;
            }
            
            // Update password
            user.password = newPassword;
            user.updatedAt = Date.now();
            users.set(username, user);
            
            // Invalidate all sessions for this user for security
            if (token) {
                sessions.delete(token);
            }
            for (const [sessionToken, session] of sessions.entries()) {
                if (session.username === username) {
                    sessions.delete(sessionToken);
                }
            }
            
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: 'Password updated successfully', username }));
            return true;
        } catch (e) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Invalid JSON' }));
            return true;
        }
    }
    
    return false;
}

// const http = require('http');

// const server = http.createServer((req, res) => {
//     // 1. Log every request (proves request flow & non-blocking nature)
//     const time = new Date().toISOString();
//     console.log(`[${time}] ${req.method} ${req.url}`);

//     // 2. Routing
//     if (req.method === 'GET' && req.url === '/') {
//         res.statusCode = 200;
//         res.end('This is / url');
//         return;
//     }

//     if (req.method === 'GET' && req.url === '/health') {
//         res.statusCode = 200;
//         res.end('This is /health url');
//         return;
//     }

//     if (req.method === 'GET' && req.url === '/about') {
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'application/json');
//         const aboutMe = {
//             name: 'Muhammad Muneeb Rehman',
//             role: 'Developer',
//             skills: ['Node.js', 'JavaScript', 'API Development'],
//             currentProject: 'Learning HTTP Server Development',
//             location: 'Working on day1.js'
//         };
//         res.end(JSON.stringify(aboutMe, null, 2));
//         return;
//     }

//     // 3. Fallback for unknown routes
//     res.statusCode = 404;
//     res.end('Error: Not Found');
//     res.end('Error: Not Found');
// });

// // 4. Server startup
// server.listen(8080, () => {
//     console.log('Server running on port 8080');
// });
