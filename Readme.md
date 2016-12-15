## Overview
This is a really basic server that serves html files to customizing mikrotik hotspots

## Getting Started

### Download project and install dependencies
Clone the repo:
```sh
git clone https://github.com/MOBDALA/passbook-server.git
cd passbook-server
```

Install dependencies:
```sh
npm install
```

### Do you wan't to try this?
The server write a file for every key in the `opts.static` and put in the `meta content` of this html files the `value`

```
const opts = {
  statics: {
    alogin: '$(link-orig)',
    login: loginUrl,
    logout: 'login.html',
    redirect: 'login.html'
  },
  tmpFolder: path.join(__dirname, './tmp', String(Date.now())),
  compressFile: path.join(__dirname, './tmp', `${String(Date.now())}-file.zip`),
  template: template
};
```

## Start server
```sh
# Start server
npm start
```