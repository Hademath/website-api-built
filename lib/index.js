"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const fs_1 = __importDefault(require("fs"));
const utilis_1 = require("./utilis");
/*
implement your server code here
*/
const port = process.env.PORT || 3005;
const server = http_1.default.createServer((req, res) => {
    if (req.url === "/products" && req.method === "GET") {
        res.writeHead(200, { "Content-Type": "application/json" });
        const content = (0, utilis_1.getDatabase)();
        // console.log(data);
        const data = JSON.parse(content);
        res.end(JSON.stringify({ products: data }, null, 2));
        return;
    }
    if (req.url === "/create-prod" && req.method === "POST") {
        const postData = async (request, response) => {
            var _a;
            try {
                await (0, utilis_1.bodyParser)(request);
                const data = (0, utilis_1.getDatabase)();
                const data2 = JSON.parse(data);
                let productId = ((_a = data2[data2.length - 1]) === null || _a === void 0 ? void 0 : _a.id) + 1 || 1;
                const dateUploaded = Date.now().toString();
                const { productName, productDescription, productVarieties } = request.body;
                data2.push({
                    productId: Date.now(),
                    productName,
                    productVarieties,
                    productDescription,
                    dateUploaded
                });
                fs_1.default.writeFileSync("./product.json", JSON.stringify(data2, null, 2));
                response.writeHead(200, { "Content-type": "/json" });
                response.end(JSON.stringify(data2));
            }
            catch (err) {
                console.log("Error occurred!", err);
                response.writeHead(400, { "Content-type": "/json" });
                return response.end("Invalid");
            }
        };
        postData(req, res);
    }
    if (req.url === "/update-prod" && req.method === "PUT") {
        const updateData = async (request, response) => {
            try {
                await (0, utilis_1.bodyParser)(request);
                const content = (0, utilis_1.getDatabase)();
                const products = JSON.parse(content);
                let productId = request.body.productId;
                if (isNaN(Number(productId))) {
                    //pro 
                    response.writeHead(400, { "Content-type": "/json" });
                    return response.end(JSON.stringify({ message: "Invalid product Id " }, null, 2));
                }
                console.log(productId);
                const product = products.find((product) => product.productId === +productId);
                if (!product) {
                    response.writeHead(404, { "Content-type": "/json" });
                    return response.end(JSON.stringify({ message: "product not found" }, null, 2));
                }
                const { productName, productDescription, productVarieties } = request.body;
                product.productName = productName || product.productName;
                product.productDescription =
                    productDescription || product.productDescription;
                product.productVarieties =
                    productVarieties || product.productVarieties;
                product.dateEdited = Date.now().toString();
                fs_1.default.writeFileSync("./product.json", JSON.stringify(products, null, 2));
                response.writeHead(200, { "Content-type": "/json" });
                response.end(JSON.stringify(products));
            }
            catch (err) {
                console.log("Error occurred!", err);
                response.writeHead(400, { "Content-type": "/json" });
                return response.end("Invalid");
            }
        };
        updateData(req, res);
    }
    if (req.url === "/delete-prod" && req.method === "DELETE") {
        const deleteData = async (request, response) => {
            try {
                await (0, utilis_1.bodyParser)(request);
                const content = (0, utilis_1.getDatabase)();
                const products = JSON.parse(content);
                let productId = request.body.productId;
                if (isNaN(Number(productId))) {
                    //pro
                    response.writeHead(400, { "Content-type": "/json" });
                    return response.end(JSON.stringify({ message: "valid product Id is required" }, null, 2));
                }
                const product = products.find((product) => product.productId === +productId);
                if (!product) {
                    response.writeHead(404, { "Content-type": "/json" });
                    return response.end(JSON.stringify({ message: "product not found" }, null, 2));
                }
                else {
                    const newProducts = products.filter((item) => item.productId !== product.productId);
                    fs_1.default.writeFileSync("./product.json", JSON.stringify(newProducts, null, 2));
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ message: `${productId} removed` }));
                }
            }
            catch (err) {
                console.log("Error occurred!", err);
                response.writeHead(400, { "Content-type": "/json" });
                return response.end("Invalid");
            }
        };
        deleteData(req, res);
    }
});
server.listen(port, () => {
    console.log("the server is running on the port 3005");
});
