const {Scenes, Markup} = require("telegraf");
const cloudinary = require('cloudinary').v2;
const admin = new Scenes.BaseScene("admin");

// Configuration 
cloudinary.config({
  cloud_name: "dcwhvaxmt",
  api_key: "357812117122521",
  api_secret: "K5lgC7jkYeenqtQv-zElWVbFpCY"
});



admin.enter(async ctx => {
 let txt = `Assalomu aleykum <a href="tg://${ctx.from.username}">${ctx.from.first_name}</a> Siz adminsiz !`;
 ctx.replyWithHTML(txt, {
    ...Markup.keyboard([
        ["Toifa qo'shish", "Mahsulot qo'shish"]
    ]).resize()
 });
});


admin.hears("Mahsulot qo'shish", ctx => {
    ctx.reply("rasm yuboring")
})

admin.on("photo", async ctx => {
  const imageId = ctx.message.photo.pop().file_id;
  const image = await ctx.telegram.getFileLink(imageId);

  const res = cloudinary.uploader.upload("https://i.blogs.es/b0cf03/318208931_700294888142342_818714537198339726_n/450_1000.jpeg", {public_id: "olympic_flag"})

  res.then(data => console.log(data))

})

module.exports = admin;