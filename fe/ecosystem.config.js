module.exports = {

  deploy: {
    "production": {
      user: "root",
      host: ['118.190.208.49'],
      ref: "origin/master",
      repo: "git@github.com:xiyuyizhi/movies.git",
      path: "/root/www/movies_fe",
      "post-setup": "ls -la",
      "post-deploy": "cd /root/www/front && rm -rf * && cd /root/www/movies_fe/current/fe/build && cp -r . /root/www/front",
    }
  }
};
