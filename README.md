Disk space analyzer for cloud services

Scans your online storage and shows you, in graphical form, where the space is being wasted, giving you an idea of where to start cleaning.

Based on Unifile, supports all Unifile services:

* Dropbox
* local file system
* FTP
* SFTP
* Github
* NextCloud/Owncloud (with webdav)

This is an equivalent of the linux colland `du -b ...path...`

## Use

Install the npm package

```
$ npm install -g cloud-analyser
```

Scan the local `Documents` folder

```
$ cloud-analyser fs ~/Documents
```

Scan remote folders:

```
$ cloud-analyser dropbox Photos
$ cloud-analyser ftp www
$ cloud-analyser github repo1/master/
```

for example the command `cloud-analyser dropbox Photos` will output something like this

```
2075407 Photos/Sample Album
2075407 Photos
```
### Options

`cloud-analyser [service] [path]`

| Service | Value of the `service` option |
| ------- | ------- |
| Dropbox | Dropbox |
| local file system | fs |
| FTP | FTP |
| SFTP | SFTP |
| Github | Github |
| NextCloud/Owncloud (with webdav) | webdav |


## Development

### Install

```
$ npm i
```

### test

Scan the local `Documents` folder

```
$ node ./lib/ fs ~/Documents
```
