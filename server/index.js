const Path = require('path');
const Hapi = require('Hapi');
const Webpack = require('webpack');
const DashboardPlugin = require('webpack-dashboard/plugin');
const Config = require('../webpack.config.js');

const server = new Hapi.Server();
const host = 'localhost';
const port = 3000;
server.connection({ host, port });

const compiler = Webpack(Config);
compiler.apply(new DashboardPlugin());

const devMiddleware = require('webpack-dev-middleware')(compiler, {
    host,
    port,
    historyApiFallback: true,
    publicPath: Config.output.publicPath,
    quiet: true  // important for webpack-dashboard to work
});

const hotMiddleware = require('webpack-hot-middleware')(compiler, {
    log: () => {}
});

server.ext('onRequest', (request, reply) => {

    devMiddleware(request.raw.req, request.raw.res, (err) => {

        if (err) {
            return reply(err);
        }

        reply.continue();
    });
});

server.ext('onRequest', (request, reply) => {

  hotMiddleware(request.raw.req, request.raw.res, (err) => {

      if (err) {
          return reply(err);
      }

      reply.continue();
  });
});

server.ext('onPreResponse', (request, reply) => {

    // This assumes you are using the html-webpack-plugin
    // If you are serving a static html file just reply with that file directly
    const filename = Path.join(compiler.outputPath, 'index.html');
    compiler.outputFileSystem.readFile(filename, (fileReadErr, result) => {

          if (fileReadErr) {
              return reply(fileReadErr);
          }

          reply(result).type('text/html');
      });
});

server.start((err) => {

    console.log('server started');

    if (err) {
        throw err;
    }
});
