// config/dbConfig1.js
const FirstDb = {
  host: "localhost",
  port: "27017",
  database: "database1",
  username: "user1",
  password: "password1",
};

// config/dbConfig2.js
const SecondDb = {
  host: "localhost",
  port: "27017",
  database: "database2",
  username: "user2",
  password: "password2",
};

const ThirdDb = {
  host: "localhost",
  port: "27017",
  database: "database3",
  username: "user3",
  password: "password2",
};

module.exports = { FirstDb, SecondDb, ThirdDb };
