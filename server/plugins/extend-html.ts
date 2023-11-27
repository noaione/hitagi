export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook("render:html", (html) => {
    // add class to html tag
    // find if there is a class already
    const htmlClass = html.htmlAttrs.findIndex((attr) => attr.startsWith("class="));

    if (htmlClass === -1) {
      // if not, add it
      html.htmlAttrs.push(`class="ht-theme-hitagi"`);
    } else {
      // if yes, append it
      // remove the last " from the class
      const htmlAttr = html.htmlAttrs[htmlClass].replace(/["']$/, "").replace(/class=["']/, `class="`);

      html.htmlAttrs[htmlClass] = `${htmlAttr} ht-theme-hitagi"`;
    }
  });
});
