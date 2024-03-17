import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import { createHandler } from "graphql-http/lib/use/express"
import { buildSchema } from "graphql"
import { ruruHTML } from "ruru/server"
import { PORT, HOSTNAME } from "../config/environment";

var app = express();
// Register middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Error handler
app.use((err, req, res, next) => {
    const {
        status = 404, message = "Error"
    } = err;
    res.status(status).json({
        message
    });
});

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    hello: String
  }
`)

// The root provides a resolver function for each API endpoint
var root = {
    hello: () => {
        return "Hello world!"
    }
}

app.all(
    "/api/v1",
    createHandler({
        schema: schema,
        rootValue: root,
    })
)

// Serve the GraphiQL IDE.
app.get("/", (_req, res) => {
    res.type("html")
    res.end(ruruHTML({ endpoint: "/api/v1" }))
})

// Server
var server = http.createServer(app);
server.listen(PORT, HOSTNAME, () => {
    console.log(`Server started running at ${HOSTNAME}:${PORT}`);
})
