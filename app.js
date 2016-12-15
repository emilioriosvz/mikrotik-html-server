'use strict';

const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const archiver = require('archiver');
const rmdir = require('rimraf');
const baseUrl = 'localhost:3000';

function createTmpFolder (opts) {
  return new Promise((resolve, reject) => {
    fs.mkdir(opts.tmpFolder, (err) => {
      Promise.all(Object.keys(opts.statics).map((file) => {
        return new Promise(function(resolve, reject) {
          let fileContent = opts.template.replace('$content', opts.statics[file])
          fs.writeFile(path.join(opts.tmpFolder, `${file}.html`), fileContent, (error) => {
            if (error) return reject(error);
            return resolve();
          })
        })
      }))
      .then(() => resolve(opts))
      .catch((error) => reject(error))
    })
  })
}

function zipFolder (opts) {
  const zipName = opts.compressFile;
  const output = fs.createWriteStream(zipName);
  const archive = archiver('zip', {store: true});

  const promise = new Promise((resolve, reject) => {
    fs.readdir(opts.tmpFolder, (err, fileArray) => {
      archive.pipe(output);

      fileArray.forEach(function (fileName) {
        let file = path.join(opts.tmpFolder, fileName);
        archive.append(fs.createReadStream(file), { name: fileName });
      })

      archive.finalize();

      resolve(opts);
    })
  })

  return promise;
}

app.get('/:splashToken', (req, res) => {
  const onError = (err) => res.send('An error occurred: ', err);
  const loginUrl = `${baseUrl}/splash/${req.params.splashToken}`;
  const template = `
    <html>
      <head>
        <meta http-equiv="refresh" content="0; url=$content"> <!-- $content will be replaced by the statics values -->
        <meta http-equiv="pragma" content="no-cache">
        <meta http-equiv="expires" content="-1">
      </head>
      <body></body>
    </html>`;

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

  createTmpFolder(opts)
    .then(zipFolder)
    .then((opts) => {
      const rstream = fs.createReadStream(opts.compressFile);
      rstream.on("error", (err) => onError(err));
      rstream.on("end", () => {
        fs.unlink(opts.compressFile);
        rmdir(opts.tmpFolder,(error, dirs, files) => {
          if (error) onError(err);
        });
      });

      res.set('Content-disposition', 'attachment; filename=file.zip');
      rstream.pipe(res);
    })
    .catch((error) => onError(error));
})

app.listen(3000, function () {
  console.log('App on port 3000!');
})
