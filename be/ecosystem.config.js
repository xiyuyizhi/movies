module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [

    // First application
    {
      name: 'movies_be',
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
      host: ['xiyuyizhi.xyz'],
      ref: "origin/redux-redux-saga",
      repo: "git@github.com:xiyuyizhi/movies.git",
      path: "/root/www/movies_be",
      "post-setup": "ls -la",
      "pre-deploy-local":"ls -la",
      "post-deploy": "cd be && npm install && pm2 delete movies_be && npm run production",
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
};
