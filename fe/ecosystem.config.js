module.exports = {
  apps: [

    // First application
    {
      name: 'ssr',
      script: './server/index.js',
      watch: true,
      env: {
        PORT: 7777,
        NODE_ENV: 'development',
        args: "http://localhost:9000"
      },
      env_production: {
        PORT: 7788,
        NODE_ENV: 'production',
        args: "http://localhost:9000"
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
