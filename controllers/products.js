const Product = require("../models/product");
const getAllProductsStatic = async (req, res) => {
  // throw new Error("testing async error");
  // const products = await Product.find({
  //   featured: true,
  //   name: "a first wooden table",
  // });
  const products = await Product.find({}).sort("-name -price");
  // res.status(200).json({ msg: "products testing route" });
  res.status(200).json({ products, nbHits: products.length });
};
const getAllProducts = async (req, res) => {
  console.log(req.query);
  const { featured, company, name, sort } = req.query;
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
  let result = Product.find(queryObject);
  if (sort) {
    const sortList = sort.split(",").join(" ");
    console.log("Sort", sort);
    result.sort(sortList);
  } else {
    result.sort("createdAt");
  }

  const products = await result;
  res.status(200).json({ products, nbHits: products.length });
};

module.exports = {
  getAllProducts,
  getAllProductsStatic,
};
