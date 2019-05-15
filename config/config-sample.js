const config = {
  app: {
    useHTTPS: true,
    key: '/etc/ssl/private/ssl-cert-snakeoil.key',
    cert: '/etc/ssl/certs/ssl-cert-snakeoil.pem',
    httpsport: '443',
    httpport: '3000'
  },
  dbconf: {
    host: 'localhost',
    port: 27017,
    name: 'myllefeuille'
  },
  resource: {
    file: 'resource-ja.js'
  }
};

module.exports = config;
