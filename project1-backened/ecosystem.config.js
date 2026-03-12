module.exports = {
  apps: [
    {
      name: "project85-backend",
      script: "index.js",
      instances: 5, // Running 5 instances to optimize performance
      exec_mode: "cluster", // Clustering mode
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        MONGO_URL:
          "mongodb+srv://Suvam:OPflNTmGUcB6wPyA@cluster0.p4stx.mongodb.net/project_01?retryWrites=true&w=majority",
        PORT: 8098,
        SERVER_ID: "YY-TEST1213",
        SALT: 3,
        SECRET_KEY: "bajilive",
        COMPANY_KEY: "D4F3BADBE0CF4BF78BC69EB60AF22D6D",
        CASINO_BASE_URL: "https://ex-api-yy2.ttbbyyllyy.com",
        OWNER_USERNAME: "owneradmin",
        OWNER_ROLETYPE: "owneradmin"
      },
      env_production: {
        NODE_ENV: "production",
        MONGO_URL:
          "mongodb+srv://Suvam:OPflNTmGUcB6wPyA@cluster0.p4stx.mongodb.net/project_01?retryWrites=true&w=majority",
        PORT: 8098,
        SERVER_ID: "YY-TEST1213",
        SALT: 3,
        SECRET_KEY: "bajilive",
        COMPANY_KEY: "D4F3BADBE0CF4BF78BC69EB60AF22D6D",
        CASINO_BASE_URL: "https://ex-api-yy2.ttbbyyllyy.com",
        OWNER_USERNAME: "owneradmin",
        OWNER_ROLETYPE: "owneradmin",
      },
    },
  ],
};
