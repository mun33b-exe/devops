const http = require('http');
const fs = require('fs');
const url = require('url');
const { json } = require('stream/consumers');


http.createServer((req, res)=>{

    let parsedUrl=url.parse(req.url, true)
 

    let products=fs.readFileSync("./products.json", "utf-8");

    let jsonProducts=JSON.parse(products);


    if (parsedUrl.pathname=="/products" && req.method=="GET" && parsedUrl.query.id==undefined) {
        res.end(products)
    }
    else if (parsedUrl.pathname=="/products" && req.method=="GET" && parsedUrl.query.id!=undefined) {
        let searchedProduct=jsonProducts.find((products)=>{
            return products.id==parsedUrl.query.id;
        })
        // if (searchedProduct!=undefined) {
        //     res.end(JSON.stringify(searchedProduct))
        // }
        console.log(searchedProduct)
    }
    

}).listen(8080);