export default function makePage(doc) {
  const main = doc.createElement("main");
  main.innerHTML = `
    <h1>Welcome to Odin's</h1>
    <div>Something something shield maiden, Yggdrasil, pillage, Ragnar Lothbrok... You like that kind of stuff, doncha?!</div>
    `;
  return main;
}
