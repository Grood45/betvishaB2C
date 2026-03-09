const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gameSchema = new Schema({
  gameProviderId: { type: Number },
  gameID: { type: Number },
  gameType: { type: Number },
  newGameType: { type: Number },
  rank: { type: Number },
  device: { type: String },
  platform: { type: String },
  provider: { type: String },
  rtp: { type: Number },
  rows: { type: Number },
  reels: { type: Number },
  lines: { type: Number },
  priority:{ type: Number },
  category: {
    type: [String], // Array of strings
    default:"all games",
},
  gameInfos: [{
    language: { type: String },
    gameName: { type: String },
    gameIconUrl: { type: String },
    name:{ type: String },
  }],
  gameName: { type: String },
  supportedCurrencies: [{ type: String }],
  blockCountries: [{ type: String }],
  isMaintain: { type: Boolean, default: false },
  isEnabled: { type: Boolean, default: false },
  isProvideCommission: { type: Boolean, default: false },
  hasHedgeBet: { type: Boolean, default: false },
  status: { type: Boolean, default: true},
  site_auth_key:{type:String, required:true, default:"BspAuthKey123"},

});

gameSchema.index({ site_auth_key: -1 });

// Add a default filter to include only games with INR in supportedCurrencies
function addINRFilter(next) {
  if (!this.getFilter().supportedCurrencies) {
    this.setQuery({ ...this.getQuery(), supportedCurrencies: "INR" });
  }
  next();
}

// Apply the filter to all find queries (find, findOne, etc.)
gameSchema.pre("find", addINRFilter);
gameSchema.pre("findOne", addINRFilter);
gameSchema.pre("findOneAndUpdate", addINRFilter);
gameSchema.pre("update", addINRFilter);
gameSchema.pre("updateOne", addINRFilter);
gameSchema.pre("updateMany", addINRFilter);

const GameStructure = mongoose.model("game", gameSchema);

module.exports = GameStructure;
