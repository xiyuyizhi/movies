module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [

    // First application
    {
      name: 'movies-be',
      script: 'bin/www',
      watch: true,
      env: {
        PORT: 9000,
        NODE_ENV: 'development'
      },
      env_production: {
        PORT: 8000,
        NODE_ENV: 'production'
      }
    }
  ],
  deploy: {
    "production": {
      user: "root",
      host: ['118.190.208.49'],
      ref: "origin/master",
      repo: "git@github.com:xiyuyizhi/movies.git",
      path: "/root/www/data_movies",
      "post-setup": "ls -la",
      "post-deploy": "cd be && npm install && pm2 kill && npm start",
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
};
