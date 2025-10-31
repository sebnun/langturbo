import { createServer } from "node:http";

const PORT = 3000;

const server = createServer((req, res) => {
  if (req.url === "/") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    res.end("<h1>Home Page</h1>");
  } else if (req.url === "/about") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    res.end("<h1>About Page</h1><p>Welcome to the about page!</p>");
  } else {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/html");
    res.end("<h1>Error 404</h1><p>Page not found!</p>");
  }
});


server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
