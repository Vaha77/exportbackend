const router = require("express").Router();
const bot = require("../bot/bot");

router.post("/send-telegram-message", async(req,res) => {
    try {
        console.log(req.body);
    const {user, product, url} = req.body;
    let media = product.images.map(url => {
          return {
                type:'photo',
                media:{
                    url:url
                },
           }       
    });

    media[0].caption = `🛍️ <b>${product.name.toUpperCase()}</b>\n\n🏫Kompaniya: <b>${product.brend}</b>\n<b>💰Narxi:</b> ${product.price}\n\n<b>👤${user.first_name} ${user.last_name}</b>\n📞Tel: ${user.phone_number}👤Username:<a href="https://t.me/${user.phone.number}">\n${user.first_name} ${user.last_name}</a>`;
    media[0].parse_mode = "HTML";
   
       bot.telegram.sendMediaGroup(process.env.GROUP_CHAT, media);
       return res.json(`${user.first_name} so'rovingiz qabul qilindi`);
    } catch (error) {
       console.log(error); 
    }


});

module.exports = router;