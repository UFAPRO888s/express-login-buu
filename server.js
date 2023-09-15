import express from "express";
import cors from "cors";
import users_api from "./routes/api/users.js";
import auth_api from "./routes/api/auth.js";
import products_api from "./routes/api/products.js";
import * as cheerio from 'cheerio';
import axios from "axios";

const app = express();
app.use(cors());
app.use(express.json());


app.get("/research", async (req, res) => {
  // const { idx } = req.query;
 // const idx = "DRAGONBKK.CLUB";
  try {
    let ifrgoalArr = [];
    const { data: html } = await axios(encodeURI(`https://scia.chanthaburi.buu.ac.th/e-research/?Per_Page=100`));
    let $ = cheerio.load(html);
    let goales = $("#table-1 > tbody > tr");
    console.log(goales.html());
    goales.each((i, el) => {
      ifrgoalArr.push({
        indxNum: i,
        title: $(el).find("td > a")?.text()?.replace(/\s/g, '' ),
        group: $(el).find("td:nth-child(2)")?.text()?.replace(/\s/g, '' ),
        Faculty: $(el).find("td:nth-child(3)")?.text().replace(/\s/g, '' ),
        Year: $(el).find("td:nth-child(4)")?.text()?.replace(/\s/g, '' ),
        Dis: $(el).find("td:nth-child(5) > a")?.attr("title")?.replace(/\s/g, '' ),
        Link: "https://scia.chanthaburi.buu.ac.th/e-research"+$(el).find("td:nth-child(6) > a")?.attr("href")?.replace(/\s|\./g, '' ),
      });
    })

    res?.status(200).json({
      Research_DATA: ifrgoalArr,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Error");
  }
});


app.use("/api/users/", users_api);
app.use("/api/users/", auth_api);
app.use("/api/products/", products_api);
app.use(function (req, res, next) {
  const error = new Error("Invalid request");
  error.status = 400;
  next(error);
});
app.use(function (error, req, res, next) {
  res.status(error.status || 500);
  res.send({
    error: {
      message: error.message,
    },
  });
});




const port = 5500;
app.listen(port, () => console.log(`server listening on port:${port}`));
