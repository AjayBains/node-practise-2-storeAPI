const Product = require("../models/product");
const getAllProductsStatic = async (req, res) => {
  // throw new Error("testing async error");
  // const products = await Product.find({
  //   featured: true,
  //   name: "a first wooden table",
  // });
  const products = await Product.find({ price: { $gt: 30 } })
    .sort("name -price")
    .select("price name");
  // res.status(200).json({ msg: "products testing route" });
  res.status(200).json({ products, nbHits: products.length });
};
const getAllProducts = async (req, res) => {
  console.log(req.query);
  const { featured, company, name, sort, fields, numericFilters } = req.query;

  queryObject = {};
  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }
  if (company) {
    queryObject.company = company;
  }
  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }
  if (numericFilters) {
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "<": "$lt",
      "<=": "$lte",
      "=": "$eq",
    };

    const regEx = /\b(<|>|>=|=|<=)\b/g;
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );
    const options = ["price", "rating"];
    filters = filters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("-");
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });

    // console.log(filters);
    //
    // console.log(numericFilters);
    console.log(queryObject);
  }
  let result = Product.find(queryObject);
  if (sort) {
    const sortList = sort.split(",").join(" ");
    console.log("Sort", sort);
    result.sort(sortList);
  } else {
    result.sort("createdAt");
  }

  if (fields) {
    const fieldsList = fields.split(",").join(" ");
    result.select(fieldsList);
  }
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result.skip(skip).limit(limit);

  const products = await result;
  res.status(200).json({ products, nbHits: products.length });
};

module.exports = {
  getAllProducts,
  getAllProductsStatic,
};
