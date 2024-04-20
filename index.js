const fs = require('fs');
const https = require('https');

function findAllMatches(text, regex) {
  const matches = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
      matches.push(match[0]);
  }
  return matches;
}

const downloadImage = (url, path) => {
  https.get(url, (response) => {
    response.pipe(fs.createWriteStream(path));
  });
}

const main = () => {
  const text = fs.readFileSync("./text.txt").toString()
  const regexExp = /https:\/\/store\.steampowered\.com\/app\/\d+/g;
  const matches = findAllMatches(text, regexExp);
  const link = "https://cdn.akamai.steamstatic.com/steam/apps/APP_ID/header.jpg"
  const imageUrls = {};
  for (match of matches) {
    const appId = match.split("/").pop();
    const imageUrl = link.replace("APP_ID", appId);
    imageUrls[appId] = imageUrl;
  }
  for (appId in imageUrls) {
    downloadImage(imageUrls[appId], `./images/${appId}.jpg`);
  }
}

main()