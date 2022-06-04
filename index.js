const http = require("http");
const manager = require("./manager");
const utils = require("./utils");

const server = http.createServer(async (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const url = req.url.split("todos/")[0];
    const method = req.method;
    const params = req.url.split("todos/")[1] || null;

    if (url === "/" && method === "GET" && params === null) {
        let data = await manager.getAll();
        res.writeHead(200);
        return res.end(JSON.stringify(data));
    }

    if (url === "/" && method === "POST" && params === null) {
        let body = await utils.getReqData(req);
        let data = await manager.create(JSON.parse(body));
        res.writeHead(200);
        return res.end(JSON.stringify(data));
    }

    if (url === "/" && method === "GET" && params) {
        let data = await manager.getById(params);
        if (data) {
            res.writeHead(200);
            return res.end(JSON.stringify(data));
        }
        else {
            res.writeHead(404);
            return res.end("Not found.");
        }
    }

    if (url === "/" && method === "PUT" && params) {
        let body = await utils.getReqData(req);
        body = JSON.parse(body);
        body = {
            ...body,
            id: params
        };
        let data = await manager.update(body);
        if (data) {
            res.writeHead(200);
            return res.end(JSON.stringify(data));
        }
        else {
            res.writeHead(404);
            return res.end("Not found.");
        }
    }

    if (url === "/" && method === "DELETE" && params) {
        await manager.delete(params);
        res.writeHead(200);
        return res.end();
    }

    res.writeHead(404);
    res.end(JSON.stringify({ message: "Route not found" }));
});

const PORT = 5000;
server.listen(PORT, () => {
    console.log(`server started on port: ${PORT}`);
});