const http = require("http");
const server = http.createServer();

const users = [
  {
    id: 1,
    name: "Rebekah Johnson",
    email: "Glover12345@gmail.com",
    password: "123qwe",
  },
  {
    id: 2,
    name: "Fabian Predovic",
    email: "Connell29@gmail.com",
    password: "password",
  },
];

const posts = [
  {
    id: 1,
    title: "간단한 HTTP API 개발 시작!",
    content: "Node.js에 내장되어 있는 http 모듈을 사용해서 HTTP server를 구현.",
    userId: 1,
  },
  {
    id: 2,
    title: "HTTP의 특성",
    content: "Request/Response와 Stateless!!",
    userId: 1,
  },
];

const postsList = [];

const httpRequest = (req, res) => {
  const { url, method } = req;
  if (url === "/") {
    if (method === "GET") {
      if (postsList.length == 0) {
        for (let i = 0; i < posts.length; i++) {
          postsList.push({
            userId: users[i].id,
            userName: users[i].name,
            postingId: posts[i].id,
            postingTitle: posts[i].title,
            postingContent: posts[i].content,
          });
        }
      }
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ postsList }));
    }
  } else if (url === "/ping") {
    if (method === "GET") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true }));
    }
  } else if (url === "/users/signup") {
    if (method === "POST") {
      let body = "";

      req.on("data", (data) => {
        body += data;
      });

      req.on("end", () => {
        const user = JSON.parse(body);

        users.push({
          id: user.id,
          name: user.name,
          email: user.email,
          password: user.password,
        });

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ users }));
      });
    }
  } else if (url === "/posts") {
    if (method === "POST") {
      let body = "";

      req.on("data", (data) => {
        body += data;
      });

      req.on("end", () => {
        const post = JSON.parse(body);

        posts.push({
          id: post.id,
          title: post.title,
          content: post.content,
          userId: post.userId,
        });
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ posts }));
      });
    } else if (method === "PATCH") {
      let body = "";

      req.on("data", (data) => {
        body += data;
      });

      req.on("end", () => {
        const patchPosts = JSON.parse(body);
        console.log(body);
        for (let i = 0; i < postsList.length; i++) {
          if (postsList[i].postingId === patchPosts.postingId) {
            postsList[i].postingContent = patchPosts.postingContent;
          }
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ postsList }));
      });
    }
  } else if (url === "/posts/all") {
    if (method === "GET") {
      if (posts.length > postsList.length) {
        const postsListLength = postsList.length;
        for (let i = postsListLength; i < posts.length; i++) {
          postsList.push({
            userId: users[i] === undefined ? i : users[i].id,
            userName: users[i] === undefined ? `new user${i}` : users[i].name,
            postingId: posts[i].id,
            postingTitle: posts[i].title,
            postingContent: posts[i].content,
          });
        }
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ postsList }));
    }
  }
};

server.on("request", httpRequest);

const IP = "127.0.0.1";
const PORT = 8000;

server.listen(PORT, IP, () => {
  console.log(`===RUN SERVER=== 
  IP: ${IP}
  PORT: ${PORT}`);
});
