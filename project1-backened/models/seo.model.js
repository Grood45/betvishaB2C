const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const metaTagsSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  keywords: {
    type: [String],
    required: true
  }
});

const seoSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  metaTags: {
    type: metaTagsSchema,
    required: true
  },
  site_auth_key:{type:String}
});

const SeoModel = mongoose.model('seo', seoSchema);

module.exports = SeoModel;