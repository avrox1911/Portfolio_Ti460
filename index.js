import express from "express";
import bodyParser from "body-parser";
import fs from "fs";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Read initial posts from JSON file
let posts = [];
try {
  const data = fs.readFileSync("posts.json");
  posts = JSON.parse(data);
} catch (err) {
  console.error("Error reading posts:", err);
}

app.get("/", (req, res) => {
  res.render("index.ejs", { posts });
});

app.post("/", (req, res) => {
  const newPost = {
    id: posts.length + 1,
    title: req.body.title,
    message: req.body.message,
    date: new Date().toISOString(),
  };
  posts.push(newPost);

  // Write updated posts to JSON file
  fs.writeFile("posts.json", JSON.stringify(posts, null, 2), (err) => {
    if (err) {
      console.error("Error writing posts:", err);
      res.status(500).send("Error saving post.");
      return;
    }
    res.redirect("/");
  });
});

app.listen(port, () =>
  console.log("Server running on http://localhost:" + port)
);
