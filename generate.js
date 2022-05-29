import {
  readJson,
  writeJson,
  writeFormatJson,
  compareDateDesc,
  query,
} from "./utils.js";

const TINFOIL_DB = "data/RU.ru.json";
const TINFOIL_VER = "data/versions.json";
const MAGNETS = "data/_nxdb.json";

const titles = readJson(TINFOIL_DB);
const versions = readJson(TINFOIL_VER);
const magnets = readJson(MAGNETS);

let nxdb = [];
let meta = {
  count: 0,
};

for (const key in titles) {
  const title = titles[key];

  if (title.id && versions.hasOwnProperty(title.id.toLowerCase())) {
    const nxdbObject = {
      id: title.id,
      title: title.name,
      banner: `https://tinfoil.media/thi/${title.id}/485/273/`,
      altBanner: title.bannerUrl,
      date: title.releaseDate,
      hash: query(title.name, "title", "hash", magnets, 2),
    };

    nxdb.push(nxdbObject);
    meta.count++;
  }
}

nxdb.sort(compareDateDesc);
writeFormatJson("data/nxdb.json", nxdb);
writeFormatJson("data/meta.json", meta);
