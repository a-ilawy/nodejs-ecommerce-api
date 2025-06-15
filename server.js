const express = require("express");
const dotenv = require("dotenv");
const moragn = require("morgan");
const dbConnection = require("./config/database");
const categoryRoute = require("./routes/categoryRoute");
const subCategoryRoute = require("./routes/subCategoryRoute");
const brandRoute = require("./routes/brandRoute");
const ProductRoute = require("./routes/productRoute");
const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/errorMiddleware");

dotenv.config({ path: "config.env" });
const app = express();

dbConnection();

app.use(express.json());
if (process.env.NODE_ENV === "development") {
  app.use(moragn("dev"));
  console.log("mode: development");
}

// Mount Routes
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/subCategories", subCategoryRoute);
app.use("/api/v1/brands", brandRoute);
app.use("/api/v1/products", ProductRoute);

// app.all('/*/', (req, res, next) => {
//     const err = new Error(`Can't find this route: ${req.originalUrl}`);
//     next(err);

// });

app.use((req, res, next) => {
  // const err = new Error(`Can't find this route: ${req.originalUrl}`);
  // next(err.message);
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

// Global error handling midleware inside express
app.use(globalError);

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

// handle rejection outside express
process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection Error: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error("shutting down....");

    process.exit(1);
  });
});
