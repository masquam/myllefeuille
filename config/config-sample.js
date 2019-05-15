const config = {
  app: {
    useHTTPS: true,
    key: '/etc/ssl/private/ssl-cert-snakeoil.key',
    cert: '/etc/ssl/certs/ssl-cert-snakeoil.pem'
  },
  dbconf: {
    host: 'localhost',
    port: 27017,
    name: 'myllefeuille'
  }
};

module.exports = config;
