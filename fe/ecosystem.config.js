module.exports = {
  apps: [

    // First application
    {
      name: 'ssr',
      script: './server/index.js',
      watch: true,
      env: {
        PORT: 7777,
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
      path: "/root/www/movies_fe",
      "post-setup": "ls -la",
      "post-deploy": "cd /root/www/front && rm -rf * && cd /root/www/movies_fe/current/fe/build && cp -r . /root/www/front",
    }
  }
};
