import xss from "xss";

function xssGuard(contents: string) {
  return xss.filterXSS(contents, {
    whiteList: {
      strong: [],
      a: ["href", "title"],
      h1: [],
      h2: [],
      h3: [],
      h4: [],
      h5: [],
      h6: [],
    },
  });
}

export default xssGuard;
