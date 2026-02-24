// const http = require('http');
// const fs = require('fs');
// const url = require('url');
// const { json } = require('stream/consumers');


// http.createServer((req, res)=>{

//     let parsedUrl=url.parse(req.url, true)
 

//     let products=fs.readFileSync("./products.json", "utf-8");

//     let jsonProducts=JSON.parse(products);


//     if (parsedUrl.pathname=="/products" && req.method=="GET" && parsedUrl.query.id==undefined) {
//         res.end(products)
//     }
//     else if (parsedUrl.pathname=="/products" && req.method=="GET" && parsedUrl.query.id!=undefined) {
//         let searchedProduct=jsonProducts.find((products)=>{
//             return products.id==parsedUrl.query.id;
//         })
//         // if (searchedProduct!=undefined) {
//         //     res.end(JSON.stringify(searchedProduct))
//         // }
//         console.log(searchedProduct)
//     }
    

// }).listen(8080);




const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.send('Dockerized Node.js App running successfully.');
});
app.get('/about', (req, res) => {
    res.send('THis is a Dockerized backend server of node');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});