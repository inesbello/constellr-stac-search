const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const geojsonValidation = require("geojson-validation");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(bodyParser.json());

// Save files temporarily in "uploads/" directory
const upload = multer({ dest: "uploads/" });

// Route for searching STAC items
app.post("/api/search", async (req, res) => {
  try {
    const searchParams = req.body;

    // POST request to the STAC search endpoint
    const response = await axios.post(
      `${process.env.STAC_API_URL}/search`,
      searchParams,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching data from STAC server:", error.message);
    res.status(500).json({ error: "Failed to fetch data from STAC server" });
  }
});

// GeoJSON file validation endpoint
app.post("/upload-geojson", upload.single("file"), (req, res) => {
  const file = req.file;
  const filePath = path.join(__dirname, file.path);

  if (
    file.mimetype !== "application/geo+json" &&
    file.mimetype !== "application/json"
  ) {
    return res
      .status(400)
      .json({ error: "Invalid file type. Please upload a GeoJSON file." });
  }

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Error reading file" });
    }

    let geoJsonObject;

    try {
      geoJsonObject = JSON.parse(data);
      // Validate if it's a proper GeoJSON object
      if (geojsonValidation.valid(geoJsonObject)) {
        let responseObject;
        // Check if the GeoJSON object is a Feature
        if (geoJsonObject.type === "Feature") {
          // Directly wrap the Feature in a FeatureCollection
          responseObject = {
            type: "FeatureCollection",
            features: [geoJsonObject],
          };
        } else if (
          geoJsonObject.type === "Point" ||
          geoJsonObject.type === "Polygon" ||
          geoJsonObject.type === "MultiPoint" ||
          geoJsonObject.type === "MultiPolygon" ||
          geoJsonObject.type === "LineString" ||
          geoJsonObject.type === "MultiLineString"
        ) {
          // Create a Feature wrapping the Geometry
          const feature = {
            type: "Feature",
            geometry: geoJsonObject,
            properties: {},
          };
          // Wrap the Feature in a FeatureCollection
          responseObject = {
            type: "FeatureCollection",
            features: [feature],
          };
        } else if (geoJsonObject.type === "FeatureCollection") {
          // If it's already a FeatureCollection, return it as is
          responseObject = geoJsonObject;
        } else {
          res.status(400).json({ error: "Invalid GeoJSON structure" });
          return;
        }
        // Send the valid GeoJSON object or FeatureCollection as the response
        res.json(responseObject);
      } else {
        res.status(400).json({ error: "Invalid GeoJSON structure" });
      }
    } catch (parseError) {
      res
        .status(400)
        .json({ error: "Error parsing JSON. Is this a valid GeoJSON file?" });
    } finally {
      // Clean up the uploaded file
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr)
          console.error("Error deleting uploaded file:", unlinkErr);
      });
    }
  });
});

app.get("/", (req, res) => {
  res.send("Geospatial Backend is running...");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
