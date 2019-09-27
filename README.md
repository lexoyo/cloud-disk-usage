Disk space analyzer for cloud services disk space usage. Think [`du`](http://www.linuxcommand.org/lc3_man_pages/du1.html) command for online storage.

Summarize cloud storage usage of each FILE, recursively for directories from local file system, Dropbox, Github, FTP, SFTP, Webdav, NextCloud, OwnCloud. 

Command line tool which scans your online storage and shows you, where the space is being wasted, giving you an idea of where to start cleaning.

## Synopsis

`cdu SERVICE FILE [OPTION]...`

Supported options

* `-a`, `--all`: write counts for all files, not just directories
* `-h`, `--human-readable`: print sizes in human readable format (e.g., 1K 234M 2G)

Supported services

| Service | Value of the `service` option |
| ------- | ------- |
| Dropbox | Dropbox |
| local file system | fs |
| FTP | FTP |
| SFTP | SFTP |
| Github | Github |
| NextCloud/Owncloud (with webdav) | webdav |

## Examples

Install the npm package

```
$ npm install -g cloud-disk-usage
```

Scan the local `Documents` folder

```
$ cdu fs ~/Videos
9568    /home/lexoyo/Videos/Webcam
116751  /home/lexoyo/Videos/peek
1852703 /home/lexoyo/Videos
```

With options

```
$ cdu fs ~/Videos -ah
9.6 M   /home/lexoyo/Videos/Webcam/2018-07-24-185812.webm
9.6 M   /home/lexoyo/Videos/Webcam
7.6 M   /home/lexoyo/Videos/peek/output.gif
7.6 M /home/lexoyo/Videos/peek
250.5 M   /home/lexoyo/Videos/hover.gif
750.5 M   /home/lexoyo/Videos/merge.gif
7.1 k /home/lexoyo/Videos/scrollbars.gif
1.0 G   /home/lexoyo/Videos
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
