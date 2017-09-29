Disk space analyzer for cloud services

Scans your online storage and shows you, in graphical form, where the space is being wasted, giving you an idea of where to start cleaning.

Based on Unifile, supports all Unifile services (Dropbox, local file system, FTP...)

## Install

```
$ npm i
```

## CLI

Command line equivalent to linux `du -b ...path...` command:

```
$ node ./lib/ fs ~/Documents
$ node ./lib/ dropbox Photos
$ node ./lib/ ftp www
$ node ./lib/ github repo1/master/
```
for example the command `node ./lib/ dropbox Photos` will output something like this

```
2075407 Photos/Sample Album
2075407 Photos
```

