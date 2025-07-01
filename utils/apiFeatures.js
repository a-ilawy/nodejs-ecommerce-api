/* eslint-disable node/no-unsupported-features/es-syntax */
class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  filter() {
    const queryStringObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields", "keyword"];
    excludedFields.forEach((field) => delete queryStringObj[field]);

    // Optional custom operator overrides
    const operatorsOverride = {
      "price[gte]": "gte", // Example: price[gte]=50 → price: {lte: 50}
    };

    // Convert query like price[gte]=50 → { price: "{lte:50}" }
    const output = Object.entries(queryStringObj).reduce(
      (acc, [key, value]) => {
        const match = key.match(/^(.+)\[(.+)\]$/);
        if (match) {
          const field = match[1];
          const operator = operatorsOverride[key] || match[2];
          acc[field] = `{${operator}:${value}}`;
        } else {
          acc[key] = value;
        }
        return acc;
      },
      {}
    );

    // Convert to actual MongoDB filters
    const mongoFilter = Object.entries(output).reduce((acc, [key, val]) => {
      const parsed = val.match(/^\{(.+):(.+)\}$/);
      if (parsed) {
        acc[key] = { [`$${parsed[1]}`]: parsed[2] };
      } else {
        acc[key] = val;
      }
      return acc;
    }, {});

    this.mongooseQuery = this.mongooseQuery.find(mongoFilter);

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }

  search(modelName) {
    if (this.queryString.keyword) {
      let query = {};
      if (modelName === "Products") {
        query.$or = [
          { title: { $regex: this.queryString.keyword, $options: "i" } },
          { description: { $regex: this.queryString.keyword, $options: "i" } },
        ];
      } else {
        query = { name: { $regex: this.queryString.keyword, $options: "i" } };
      }

      this.mongooseQuery = this.mongooseQuery.find(query);
    }
    return this;
  }

  paginate(countDocuments) {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 50;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;

    // Pagination result
    const pagination = {};
    pagination.currentPage = page;
    pagination.limit = limit;
    pagination.numberOfPages = Math.ceil(countDocuments / limit);

    // next page
    if (endIndex < countDocuments) {
      pagination.next = page + 1;
    }
    if (skip > 0) {
      pagination.prev = page - 1;
    }
    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);

    this.paginationResult = pagination;
    return this;
  }
}

module.exports = ApiFeatures;
