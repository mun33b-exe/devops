// const http = require('http');
// http.createServer((req, res)=>{
//     if (req.url=='/' && req.method=="GET") {
//         res.end("This is / url");
//     }
//     else if (req.url=='/health' && req.method=="GET") {
//         res.end("This is /health url");
//     }
//     else{
//         console.log(res.statusCode=404);
//         console.log(req.method)
//         console.log(req.url)
//         res.end("Error : Not Found")
//     }
// }).listen(8080);




const http = require('http');

const server = http.createServer((req, res) => {
    // 1. Log every request (proves request flow & non-blocking nature)
    const time = new Date().toISOString();
    console.log(`[${time}] ${req.method} ${req.url}`);

    // 2. Routing
    if (req.method === 'GET' && req.url === '/') {
        res.statusCode = 200;
        res.end('This is / url');
        return;
    }

    if (req.method === 'GET' && req.url === '/health') {
        res.statusCode = 200;
        res.end('This is /health url');
        return;
    }

    if (req.method === 'GET' && req.url === '/about') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        const aboutMe = {
            name: 'Muhammad Muneeb Rehman',
            role: 'Developer',
            skills: ['Node.js', 'JavaScript', 'API Development'],
            currentProject: 'Learning HTTP Server Development',
            location: 'Working on day1.js'
        };
        res.end(JSON.stringify(aboutMe, null, 2));
        return;
    }

    // 3. Fallback for unknown routes
    res.statusCode = 404;
    res.end('Error: Not Found');
    res.end('Error: Not Found');
});

// 4. Server startup
server.listen(8080, () => {
    console.log('Server running on port 8080');
});
