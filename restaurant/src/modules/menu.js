export default function makePage(doc) {
  const main = doc.createElement("main");
  main.innerHTML = `
    <h1>Menu</h1>
    <div>This is where the menu would be but we... sacrificed the chef? Have some mead on the house instead!</div>
    `;
  return main;
}
