#!/usr/bin/env node
'use strict';

// node modules
const Path = require('path');
// const Os = require('os');
const fs = require('fs');
const Unifile = require('unifile');
const launcher = require('browser-launcher3');
const express = require('express')

// config
const port = process.env.PORT || '6805';
const rootUrl = `http://localhost:${port}`;
const [node, script, connectorName, rootPath='/'] = process.argv;

console.log(connectorName, rootPath);

// init unifile
const unifile = new Unifile();
const session = {};
const connector = (() => {
	switch(connectorName) {
	  case 'fs':
			return new Unifile.FsConnector({
        showHiddenFile: false,
        sandbox: '/', //Os.homedir(),
        infos: {
          displayName: 'File System',
        },
      });
		case 'ftp':
			return new Unifile.FtpConnector({
			  redirectUri: rootUrl + '/ftp/signin',
			});
		case 'github':
			return new Unifile.GitHubConnector({
        clientId: process.env.GITHUB_APP_ID || '9470507937d6b04a70bd',
        clientSecret: process.env.GITHUB_APP_SECRET || '106624aedeab491b5f31b361a5d63246250fa8c1',
        state: 'aaathub',
        redirectUri: process.env.GITHUB_APP_REDIRECT || rootUrl + '/github/oauth_callback',
      });
		case 'dropbox':
			return new Unifile.DropboxConnector({
        clientId: process.env.DROPBOX_APP_ID || '8lxz0i3aeztt0im',
        clientSecret: process.env.DROBOX_APP_SECRET || 'twhvu6ztqnefkh6',
        state: 'aaathub',
        redirectUri: process.env.DROPBOX_APP_REDIRECT || rootUrl + '/dropbox/oauth_callback',
			});
		default:
			console.error('Connector not found:' + connectorName);
			process.exit(1);
	}
})();
unifile.use(connector);

// authentication
console.log('authenticate', session, connectorName);
const savedSession = fs.existsSync('.cloud-analyser') ? JSON.parse(fs.readFileSync('.cloud-analyser')) : null;
if(savedSession && savedSession[connectorName]) {
	console.log('Got session from file .cloud-analyser', savedSession);
	Object.assign(session, savedSession);
	ls(rootPath)
	.then(tree => {
		displayTree(tree);
	})
}
else {
	unifile.getAuthorizeURL(session, connectorName)
	.catch((err) => {
		throw('Error while authorizing Unifile: ' + err);
	})
	.then(result => {
		console.log('authorize URL', result, session);
		if(!result) return Promise.resolve();
		return new Promise((resolve, reject) => {
			launcher((err, launch) => {
				if ( err ) {
					console.error('Can not open browser for auth', err);
					reject(err);
				}
				launch(result, process.env.BROWSER || 'firefox', (err, instance) => {
					if(err) {
						console.error('Can not open auth URL', err);
						reject(err);
					}
					instance.on( 'stop', function( code ) {
						// console.log('Instance stopped with exit code:', code);
					});
					waitForToken()
					.then(() => {
						instance.stop();
						resolve();
					})
					.catch(e => {
						instance.stop();
						reject(e);
					});
				});
			});
		})
	})
	.catch((err) => {
		console.error('Error while authorizing Unifile:', err);
		process.exit(1);
	})
	.then((res) => {
		console.log('authorized', session, res);
		fs.writeFileSync('.cloud-analyser', JSON.stringify(session));
		return ls(rootPath);
	})
	.then(tree => {
	//  console.log('xxx', tree, tree.items, tree.size, tree.path);
	//	console.assert(tree.path === rootPath, 'head name');
	//	console.assert(tree.items === 20, 'number of items');
	//	console.assert(tree.size === 721287921, tree.size + ' should be 721287921');
		displayTree(tree);
	})
}

function ls(path) {
  return unifile.readdir(session, connectorName, path)
	.then(files => {
		const info = files.reduce(
		  (prev, file) => {
				return {
					items: prev.items + 1,
					size: isNaN(file.size) ? prev.size : prev.size + file.size
				}
			},
			{items: 0, size: 0}
	  );
		const promises = files
		.filter(file => file.isDir)
    .map(dir => ls(path + '/' + dir.name));
		return Promise.all(promises).then(children => {
			const childrenInfo = children.reduce(
				(sum, child) => {
					return {
						size: sum.size + child.size,
						items: sum.items + child.items
					}
				},
				{size: 0, items: 0}
			);
			return {
  			path: path,
  			items: info.items + childrenInfo.items,
  			size: info.size + childrenInfo.size,
  			children: children,
  		};
		});
  });
}

// linux `du -b` command notation
function displayTree(tree) {
  tree.children.forEach(child => displayTree(child));
	console.info(tree.size + '\t' + tree.path);
}


function waitForToken() {
	let server = null;
  return new Promise((resolve, reject) => {
	  const app = express()
    server = app.listen(port, () => {
      console.log('Listening for oauth callback');
			// register callback url
			app.get('/:connector/oauth_callback', (req, res) => {
				if('error' in req.query) {
					res.status(500).send(req.query);
					reject(req.query);
				} else {
					unifile.login(session, req.params.connector, req.query)
					.then((result) => {
						if(result) {
							res.cookie('unifile_' + req.params.connector, result);
							res.end('<script>window.close();</script>');
							resolve();
						}
						else {
						  reject('auth failed');
						}
					})
					.catch((err) => {
						console.error('ERROR', err);
						res.status(500).send(err);
						reject(err);
					});
				}
			});
			app.get('/:connector/signin', (req, res) => {
				res.sendFile(Path.join(__dirname, '..', 'oauth_callbacks', req.params.connector + '_login.html'));
			});
    })
	}).then(() => {
		console.log('stop server, login success');
		server.close();
	}).catch(e => {
		console.log('stop server, login failed');
		server.close();
		return Promise.reject(e);
	});
}


