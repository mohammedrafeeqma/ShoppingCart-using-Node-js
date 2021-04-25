var express = require("express");
var router = express.Router();
var productHelpers = require("./helpers/product-helpers");

/* GET users listing. */
router.get("/", function (req, res, next) {
  let products = [
    {
      name: "redmi note9",
      category: "mobile",
      description: "this is a good phone",
      image:
        "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRvv7I0H4cdISKBaFO1AkoTBNyvXwh_aTacPDVRqNtDH-DdgkZLVDnglV3yf7mj2tTsRojT4cJ-_X59dv0Ug2sqBQEWdrNdmF84Huhe-KUlFnVWuBrr32e0yw&usqp=CAE",
    },
    {
      name: "iphone",
      category: "mobile",
      description: "this is a iphone",
      image:
        "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRQ8QJPKn-Oo2HI2oeJxfpDKw_vaRiycDfkIFsSOBrAP8Q1gd1GWIlrvd3Gk_NWrifeTfXnxj2uk4Z8WbovtcW2BymYNWtwQDBiD_6JTLa9&usqp=CAE",
    },
    {
      name: "one plus nord",
      category: "Mobile",
      description: "this is a one plus nord",
      image:
        "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcTs-FVtxl1ARJXS0srZf7R_h-3uXpAEb6dxEuvO_yzXShKNBol16ZN-VYkGE45PehKvJIpwKVjM7SDu0MBKrqD325vMzJUQ4Q_nWUgawuW3VCsumuQVpmmwFQ&usqp=CAE",
    },
    {
      name: "opoo k3",
      category: "mobile",
      description: "this is a oppo k3",
      image:
        "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQYHDgZGKYC-CgLDOD2XN16qfOxzHv2QGnCXcStbjBqEqGEoHMc2or5ZTq702TQBxuOPAAoG7nwIHp8nh8b7OqyLHQS-OZm&usqp=CAE",
    },
  ];

  res.render("admin/admin-products", { admin: true, products });
});

// to add Product
router.get("/add-product", (req, res) => {
  res.render("admin/add-product");
});

router.post("/add-product", (req, res) => {
  console.log(req.body);
  console.log(req.files.Image); //to got uploaded file

  productHelpers.addProduct(req.body, (id) => {
    //it is call function from product-helpers
    let image = req.files.Image;
    //it is for store image in different path
    image.mv("/home/rafeeq/Desktop/Nodejs/project/shopping cart/public/product-images/" +
        id + ".jpg",
      (err, done) => {
        
        if (!err) {
          res.render("admin/add-product");
        } else {
          console.log(err);
        }
      }
    );
  });
});

module.exports = router;
