var express = require("express");
var router = express.Router();
require("dotenv").config();
const fetch = require("node-fetch");
const City = require("../models/cities");
const API_KEY = process.env.OWM_API_KEY;

router.post("/", async (req, res) => {
  try {
    const cityName = (req.body.cityName || "").trim();
    if (!cityName) {
      return res.json({ result: false, error: "Missing city name" });
    }

    // Doublon exact (case-insensitive)
    const existing = await City.findOne({
      cityName: { $regex: new RegExp(`^${cityName}$`, "i") },
    });
    if (existing) {
      return res.json({ result: false, error: "City already saved" });
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      cityName
    )}&appid=${API_KEY}&units=metric`;

    const response = await fetch(url);
    const apiData = await response.json();

    // Garde anti-crash si OWM renvoie une erreur (clé invalide, ville introuvable, etc.)
    if (!response.ok || !apiData?.weather?.[0] || !apiData?.main) {
      return res.json({
        result: false,
        error: apiData?.message || "Weather API error",
      });
    }

    const newCity = await new City({
      cityName,
      main: apiData.weather[0].main,
      description: apiData.weather[0].description,
      tempMin: apiData.main.temp_min,
      tempMax: apiData.main.temp_max,
    }).save();

    res.json({ result: true, weather: newCity });
  } catch {
    res.json({ result: false, error: "Internal error" });
  }
});

router.get("/", (req, res) => {
  City.find().then((data) => {
    res.json({ weather: data });
  });
});

router.get("/:cityName", (req, res) => {
  City.findOne({
    cityName: { $regex: new RegExp(`^${req.params.cityName}$`, "i") },
  }).then((data) => {
    if (data) {
      res.json({ result: true, weather: data });
    } else {
      res.json({ result: false, error: "City not found" });
    }
  });
});

router.delete("/:cityName", (req, res) => {
  City.deleteOne({
    cityName: { $regex: new RegExp(`^${req.params.cityName}$`, "i") },
  }).then((deletedDoc) => {
    if (deletedDoc.deletedCount > 0) {
      // document successfully deleted
      City.find().then((data) => {
        res.json({ result: true, weather: data });
      });
    } else {
      res.json({ result: false, error: "City not found" });
    }
  });
});

module.exports = router;
