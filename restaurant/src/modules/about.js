export default function makePage(doc) {
  const main = doc.createElement("main");
  main.innerHTML = `
    <h1>About Odin</h1>
    <div>Odin (/ˈoʊdɪn/; from Old Norse: Óðinn) is a widely revered god in Norse mythology and Germanic paganism. Most surviving information on Odin comes from Norse mythology, but he figures prominently in the recorded history of Northern Europe (<a href="https://en.wikipedia.org/wiki/Odin">source: Wikipedia</a>)</div>
    `;
  return main;
}
