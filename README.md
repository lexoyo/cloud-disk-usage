Disk space analyzer for cloud services. Think [`du`](http://www.linuxcommand.org/lc3_man_pages/du1.html) command for online storage.

Summarize cloud storage usage of each FILE, recursively for directories from local file system, Dropbox, Github, FTP, SFTP, Webdav, NextCloud, OwnCloud. 

Command line tool which scans your online storage and shows you, where the space is being wasted, giving you an idea of where to start cleaning.

Synopsis

`cdu [OPTION]... FILE`

Supported options

* `-a`, `--all`: write counts for all files, not just directories
* `-h`, `--human-readable`: print sizes in human readable format (e.g., 1K 234M 2G)

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
$ npm install -g cloud-disk-usage
```

Scan the local `Documents` folder

```
$ cdu fs ~/Documents
```

Scan remote folders:

```
$ cdu dropbox Photos
$ cdu ftp www
$ cdu github repo1/master/
```

for example the command `cdu dropbox Photos` will output something like this

```
2075407 Photos/Sample Album
2075407 Photos
```
### Options

`cdu [service] [path]`

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
