import fs from "fs";
import lev from "js-levenshtein";

export function readJson(path) {
  return JSON.parse(fs.readFileSync(path, { encoding: "utf8" }));
}

export function writeJson(path, data) {
  fs.writeFileSync(path, JSON.stringify(data), { encoding: "utf8" });
}

export function writeFormatJson(path, data) {
  fs.writeFileSync(path, JSON.stringify(data, false, " "), {
    encoding: "utf8",
  });
}

export function sortByKey(arr, key) {
  return arr.sort((a, b) => {
    if (a[key] < b[key]) {
      return -1;
    }
    if (a[key] > b[key]) {
      return 1;
    }
    return 0;
  });
}

export function compareDateDesc(a, b) {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
}

export function compareHashDesc(a, b) {
  if (a.hash !== "" && b.hash !== "") {
    return a.hash > b.hash;
  } else if (a.hash !== "") {
    return a.hash > b.hash;
  } else if (b.name !== "") {
    return a.hash > b.hash;
  } else {
    return a.hash > b.hash;
  }
}

export function query(query, inProp, outProp, array, koef = 5) {
  for (const arrEl of array) {
    if (lev(arrEl[inProp], query) < koef) {
      return arrEl[outProp];
    }
  }
  return "";
}
