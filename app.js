import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import ejs from "ejs";

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

main().catch((err) => console.log(err));

//connect
async function main() {
  await mongoose.connect("mongodb://localhost:27017/wikiDB");
}

//create schema
const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
});

//model
const Article = mongoose.model("Article", articleSchema);

app.get("/", function (req, res) {
  res.send("Hello World!");
});

//chainable route handler
app
  .route("/articles")
  .get(function (req, res) {
    Article.find(function (err, foundArticle) {
      if (!err) {
        res.send(foundArticle);
      } else {
        res.send(err);
      }
    });
  })
  .post(function (req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    newArticle.save(function (err) {
      if (!err) {
        res.send("Succesfully added new article");
      } else {
        res.send(err);
      }
    });
  })
  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (!err) {
        res.send("Successfully deleted all articles.");
      } else {
        res.send(err);
      }
    });
  });

app
  .route("/articles/:articleTitle")

  .get(function (req, res) {
    Article.findOne({ title: req.params.articleTitle }, (err, foundArticle) => {
      if (!err) {
        res.send(foundArticle);
      } else {
        res.send(err);
      }
    });
  })
  .put(function (req, res) {
    Article.findOneAndUpdate(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      { overwrite: true },
      function (err) {
        if (!err) {
          res.send("Successfully updated article.");
        }
      }
    );
  })

  .patch(function (req, res) {
    Article.findOneAndUpdate(
      { title: req.params.articleTitle },
      { $set: req.body },
      function (err) {
        if (!err) {
          res.send("Successfully updated article.");
        } else {
          res.send(err);
        }
      }
    );
  })

  .delete(function (req, res) {
    Article.deleteOne({ title: req.params.articleTitle }, function (err) {
      if (!err) {
        res.send("Successfully deleted this article.");
      } else {
        res.send(err);
      }
    });
  });

app.listen(3000, function (req, res) {
  console.log("Server started on port 3000");
});
