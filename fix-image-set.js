// fix-image-set.js
import fs from "fs";
import postcss from "postcss";
import valueParser from "postcss-value-parser";

const file = process.argv[2] || "./css/style.css";
const fromPrefix = "/img/";
const toPrefix = "../img/";

const css = fs.readFileSync(file, "utf8");
const root = postcss.parse(css);

function rewriteUrlNode(urlNode) {
  if (urlNode && (urlNode.type === "string" || urlNode.type === "word")) {
    const val = urlNode.value;
    if (val.startsWith(fromPrefix)) {
      urlNode.value = toPrefix + val.slice(fromPrefix.length);
    }
  }
}

root.walkDecls(/^(background(?:-image)?)$/i, (decl) => {
  if (!/(^|-)image-set\(/.test(decl.value)) return;

  const ast = valueParser(decl.value);
  ast.walk((node) => {
    if (
      node.type === "function" &&
      (node.value === "image-set" || node.value === "-webkit-image-set")
    ) {
      node.nodes.forEach((child) => {
        if (child.type === "function" && child.value === "url") {
          rewriteUrlNode(child.nodes[0]);
        }
      });
    }
  });
  decl.value = ast.toString();
});

root.walkDecls(/^(?:-webkit-)?mask-image$/i, (decl) => {
  const ast = valueParser(decl.value);

  ast.walk((node) => {
    if (node.type === "function" && node.value === "url") {
      rewriteUrlNode(node.nodes[0]);
    }
    if (
      node.type === "function" &&
      (node.value === "image-set" || node.value === "-webkit-image-set")
    ) {
      node.nodes.forEach((child) => {
        if (child.type === "function" && child.value === "url") {
          rewriteUrlNode(child.nodes[0]);
        }
      });
    }
  });

  decl.value = ast.toString();
});

fs.writeFileSync(file, root.toString(), "utf8");
console.log(
  `✅ Готово: замінив "${fromPrefix}" → "${toPrefix}" у background(-image) з image-set, а також у mask-image та -webkit-mask-image (url(...) і image-set) у ${file}`
);
