const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const setting = new Schema({
  logo: {
    type: String,
  },
  fav_icon: {
    type: String,
  },
  marque: {
    type: String,
  },
  fnq: {
    type: Array,
  },
  tc: {
    type: String,
  },
  facebook: {
    type: String,
    default:""
  },
  whatsapp: {
    type: String,
    default:""
  },
  instagram: {
    type: String,
    default:""
  },

  teligram: {
    type: String,
    default:""
  },
  twitter: {
    type: String,
    default:""
  },
  linkedin: {
    type: String,
    default:""
  },
  social_media: {
    whatsapp: {
      title: { type: String, default: "WhatsApp" },
      image: { type: String, default: "RiWhatsappFill" }, // Replace with actual font icon logic
      link: { type: String, default: "" }
    },
    email: {
      title: { type: String, default: "Email" },
      image: { type: String, default: "MdEmail" }, // Replace with actual font icon logic
      link: { type: String, default: "" }
    },
    telegram: {
      title: { type: String, default: "Telegram" },
      image: { type: String, default: "SiTelegram" }, // Replace with actual font icon logic
      link: { type: String, default: "" }
    }
  },
  affiliate_media: [
    {
      title: { type: String, default:"", },
      description: { type: String, default:"", },
      url: { type: String, default:"" }
    }
  ],
  carousels: { type: Array },
  affiliate_data: {
    description: { type: String },
    title: { type: String },
    image: { type: String }
  },
  site_fav_icon: { type: String, default: "" },
  site_logo: { type: String, default: "" },
  site_logo_mobile: { type: String, default: "" },
  is_signup_enabled: { type: Boolean, default: true },
  site_auth_key: { type: String },
});

const Setting = mongoose.model("setting", setting);

module.exports = Setting;


// $2b$04$e9qyiG2gomb1bYcrosQihuEp73TgKxpGUviOEWCILCkubHOKK0A7.