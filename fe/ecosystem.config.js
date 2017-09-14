module.exports = {

  deploy: {
    "production": {
      user: "root",
      host: ['118.190.208.49'],
      ref: "origin/master",
      repo: "git@github.com:xiyuyizhi/movies.git",
      path: "/root/www/data_movies_front",
      "post-setup": "ls -la",
      "post-deploy": "cd /root/www/front && rm -rf * && cd /root/www/data_movies_front/build && cp -r . /root/www/front",
    }
  }
};
