/*

a reverse proxy for IP based access control lists.  (ACL)

the proxy target is: https://jsonplaceholder.typicode.com
we are proxying the https://jsonplaceholder.typicode.com/users endpoint.

*/

import express = require('express');
import { createProxyMiddleware, Filter, Options, RequestHandler } from 'http-proxy-middleware';
import iputils from './utils/iputil';
import settings from './settings';
import { fireHolutil } from './utils/fireHolutil';

async function main(): Promise<void> {

  const fireHol = new fireHolutil();
  await fireHol.init();
  console.info('%j', fireHol.status());

  // setup the express app and proxy parts
  const app = express();

  // middleware setup for IP ACL
  const options = {
    target: settings.proxy.target,
    changeOrigin: true,
    ws: true,
    onError(err, req, res) {
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end('Server Error');
        console.log(err);
    },
    onProxyReq(proxyReq, req, res) {
      const ip = iputils.clientip(req);
      const [blocked,source] = fireHol.isBlocked(ip);
      if (blocked) {
        console.error("proxy reject", ip );
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`Server Error ipblock source: ${source}`);
      }
    }
  };

  // load proxy paths
  settings.proxy.paths.forEach(async (x) => {
    app.use(x, createProxyMiddleware(x,options));
  });

  app.listen(1337, function(){
    console.info("ip-acl proxy listening on port %d in %s mode", this.address().port, app.settings.env);
  });

}
main().catch(console.error);