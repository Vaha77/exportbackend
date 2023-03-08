const router = require("express").Router();
const mongoose = require("mongoose");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const {Categories, validate} = require("../modeles/categories");
const upload = require("../middlewares/upload");
const checkToken = require("../middlewares/checkToken");

router.get("/categories", async (req, res) => {
    try {
        let length = await Categories.countDocuments();

        let page = parseInt(req.query.page) - 1 || 0;
        let limit = parseInt(req.query.limit) || 10;
        let search = req.query.search || "";

        const categories = await Categories.find({
            title: { $regex: search, $options: "i" }
        })
            .skip(page * limit)
            .limit(limit)


        return res.json({
            total_page: Math.ceil(length/limit),
            page: page + 1,
            limit: limit,
            sts: 200,
            msg: "success!",
            result: categories
        });
    } catch (err) {
        console.log(err.message)
    }
});
 

router.post("/categories", async (req, res) => {

    let uploadImage = upload.single("image");
    uploadImage(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            if(err.code === "LIMIT_UNEXPECTED_FILE") return res.json({sts:400, msg:"Rasm 1ta dan oshlmasligini kerak!"});
            if(err.code === "LIMIT_FILE_SIZE") return res.json({sts:400, msg:"Rasm 1MB dan oshlmasligini kerak!"});
            return res.json({error:err.message});
        }else if(err) {
            if(err.code == "INCCORECT_FILE_TYPE") {
                return res.json({sts:400, msg:"Iltimos rasm yuboring ('jpg, png, jpeg, gif') formatda"});
            }
        }

    try {
        const {error} = validate(req.body);
        if(error) {
            if (req.file) {               
                    let filename = req.file.filename;
                    let filePath = path.join(__dirname, `../uploads/images/${filename}`);
                    await fs.unlink(filePath, (err) => console.log(err.message));
            }

            return res.json({msg:error.details[0].message})
        }

        const category = await Categories.findOne({ title: req.body.title });
			if (category) {
            if (req.file) {
                    let filename = req.file.filename;
                    let filePath = path.join(__dirname, `../uploads/images/${filename}`);
                    await fs.unlink(filePath, (err) => err ? console.log(err) : null);
            }
            
            return res.json({ sts: 200, msg: "such a category exists!" })
        }
        const savedCategory = await new Categories({
            ...req.body,
            image: req.file ? `${req.protocol}://${req.hostname}:${process.env.PORT}/${req.file.destination}/${req.file.filename}`:'https://neuroup.com.br/wp-content/themes-wp-appkit/q-ios/img/img-icon.svg'
        }).save();

        return res.json({ sts: 201, msg: "success added!", result: savedCategory })
    } catch (err) {
        console.log(err)
    }

})

});


router.get("/categories/:id", async (req,res) => {
    try {
        const result = await Categories.findById(req.params.id);
        return res.json({sts:200, msg:"success", result});
    } catch (error) {
        
    }
})

router.put("/categories/:id", async (req, res) => {
    try {
        const update = await Categories.findByIdAndUpdate(req.params.id, req.body);
        return res.json({ sts: 200, msg: "success updated!" });
    } catch (err) {
        console.log(err)
    }
})

router.delete("/categories/:id", async (req, res) => {
    try {
        const isObjectId = mongoose.isObjectIdOrHexString(req.params.id);
        if (!isObjectId) return res.json({ msg: "error id not found!" });
        const deleted = await Categories.findByIdAndRemove(req.params.id);
        if (!deleted) return res.json({ msg: "error id not found!" })
        const filename = deleted.image.split("/").pop();
        fs.unlink(path.join(__dirname, `../uploads/images/${filename}`), (err) => {
            if(err) return;
        });
        return  res.json({ status: 200, msg: "success deleted!" })

    } catch (error) {
        console.log(error.message)
    }
});


module.exports = router;

