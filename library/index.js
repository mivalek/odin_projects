const myLibrary = [];

function Book(title, author, pages, read) {
  if (!new.target) throw "function must be called using the new keyword";
  this.id = crypto.randomUUID();
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

Book.prototype.remove = function () {
  this.element?.remove();
  const idx = myLibrary.indexOf(this);
  myLibrary.splice(idx, 1);
};
Book.prototype.toggleRead = function () {
  this.read = !this.read;
  this.element.dataset.read = this.read;
};

function addBookToLibrary(title, author, pages, read) {
  const book = new Book(title, author, pages, read);
  myLibrary.push(book);
}

function openForm() {
  const dialog = document.querySelector("#add-book-dialog");
  dialog.showModal();
}

function validate(fd) {
  let res = true;
  ["title", "author", "pages"].forEach((f) => {
    if (fd.get(f) === "") res = false;
  });
  return res;
}
function addBook(e) {
  e.preventDefault();
  const form = e.target.parentElement;
  const formData = new FormData(form);
  const isValid = validate(formData);
  if (!isValid) {
    form.setAttribute("invalid", "true");
    return;
  }
  const isRead = !!formData.get("read");
  addBookToLibrary(
    formData.get("title"),
    formData.get("author"),
    Number(formData.get("pages")),
    isRead,
  );
  makeLibrary();
  form.reset();
  form.removeAttribute("invalid");
  form.parentElement.close();
}

function removeBook(id) {
  const book = myLibrary.find((book) => book.id === id);
  book.remove();
}

function markBook(id) {
  const book = myLibrary.find((book) => book.id === id);
  book.toggleRead();
}
const libDiv = document.querySelector("#library");

function makeLibrary() {
  myLibrary.forEach((book) => {
    if (document.querySelector(`.card[data-id='${book.id}']`)) return;
    const card = document.createElement("DIV");
    card.classList.add("card");
    card.dataset.id = book.id;
    card.dataset.read = book.read;
    card.innerHTML = `<div class="status">read</div>
    <div class="title">${book.title}</div>
    <div class="author">by ${book.author}</div>
    <div class="pages">${book.pages} pages</div>
    <div class="btn-container">
        <button class="btn-outline mark-read mark-book">Mark read</button>
        <button class="btn-primary mark-unread mark-book">Mark unread</button>
        <button class="btn-delete remove-book">Remove</button>
    </div>`;
    card
      .querySelector(".remove-book")
      .addEventListener("click", () => removeBook(book.id));
    card
      .querySelectorAll(".mark-book")
      .forEach((btn) => btn.addEventListener("click", () => markBook(book.id)));
    libDiv.appendChild(card);
    book.element = card;
  });
}

function init() {
  addBookToLibrary("The Hobbit", "J.R.R. Tolkien", 259, true);
  addBookToLibrary("Debt: The first 5000 years", "D Graeber", 678, false);

  document.querySelector("#new-book").addEventListener("click", openForm);
  document.querySelector("#add-book").addEventListener("click", addBook);

  makeLibrary();
}

init();
