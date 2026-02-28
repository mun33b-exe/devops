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
