//Classes
class Book {
  constructor(
    title = '',
    author = '',
    pages = '100',
    isRead = false

  ) {
    this.title = title
    this.author = author
    this.pages = pages
    this.isRead = isRead
  }
}

class Library {
  constructor() {
    this.books = []
  }

  addBook(newBook) {
    if (!this.isInLibrary(newBook)) {
      this.books.push(newBook)
    }
  }

  removeBook(title) {
    this.books = this.books.filter((book) => book.title !== title)
  }

  getBook(title) {
    return this.books.find((book) => book.title === title)
  }

  isInLibrary(newBook) {
    return this.books.some((book) => book.title === newBook.title)
  }
}

const library = new Library()

//UI
const addBookBtn = document.getElementById('add-book')
const rmBookBtn = document.getElementById('remove-book')
const addBookModal = document.getElementById('addBookModal')
const overlay = document.getElementById('overlay')
const addBookForm = document.getElementById('addBookForm')
const shelfContainer = document.getElementById('shelfContainer')
const removeList = document.getElementById('removeBookModal')
var shelf = document.getElementById('shelfContainer').lastElementChild


const createBookCard = (book) => {
  const bookCard = document.createElement('div')
  const bookCover = document.createElement('div')
  const bookSide = document.createElement('div')
  const bookmark = document.getElementById('bookmark')
  const bookmarkClone = bookmark.cloneNode(true)
  const title = document.createElement('p')
  const author = document.createElement('p')
  bookCard.classList.add('book')
  bookCover.classList.add('book-cover')
  bookSide.classList.add('book-side')
  title.id = 'title'
  author.id = 'author'
  title.textContent = book.title
  author.textContent = book.author
  bookCard.appendChild(bookSide)
  bookCard.appendChild(bookCover)
  bookCover.appendChild(author)
  bookCover.appendChild(title.cloneNode(true))
  if(book.isRead){ bookmarkClone.classList.add('active')}
  bookCover.appendChild(bookmarkClone)
  bookSide.appendChild(title)
  shelf.appendChild(bookCard)
  bookCard.style.background = 'hsl(' + Math.floor(Math.random() * 255) +', 30%, 45%)' 
  bookCard.style.width = book.pages/2 +'px'
  var offset = ( Math.floor(Math.random() * 40))
  bookCard.style.height = 300 + offset +'px'
  bookCover.onclick = toggleRead
}

const updateBookShelf = () => {

  resetBookShelf()
  var currentPageCount = 0
  for (let book of library.books) {
    console.log( currentPageCount + '<' + parseInt(shelf.clientWidth)*3)
    currentPageCount += parseInt(book.pages/2)
    if(currentPageCount < parseInt(shelf.clientWidth)*3){
      createBookCard(book)
    } else {
      createNewShelf()
      createBookCard(book)
      currentPageCount = 0
    }
  updateRemoveList()
}
}

const updateRemoveList = () => {
  resetRemoveList()
  for (let book of library.books) {
    const bookEntry = document.createElement('div')
    const title = document.createElement('p')
    const removeButton = document.createElement('p')
    title.innerText = book.title
    removeButton.innerText = 'X'
    bookEntry.classList.add('book-entry')
    title.id = 'removeTitle'
    removeButton.id = 'removeButton'
    removeButton.onclick = removeBook
    bookEntry.appendChild(title)
    bookEntry.appendChild(removeButton)
    removeList.appendChild(bookEntry)
}
}

const resetRemoveList = () => {
  removeList.innerHTML = ''
}
const createNewShelf= () => {
    const newShelf = document.createElement('div')
    newShelf.classList.add('shelf')
    shelfContainer.appendChild(newShelf)
    shelf = document.getElementById('shelfContainer').lastElementChild
}
const resetBookShelf = () => {
  shelfContainer.innerHTML = ''

}


const toggleAddBookModal = () => {
  addBookForm.reset()
  addBookModal.classList.toggle('active')
  overlay.classList.toggle('active')
  addBookBtn.classList.toggle('active')
}

const addBook = (e) => {
  e.preventDefault()
  const newBook = getBookFromInput()
  library.addBook(newBook)
  saveLocal()
  updateBookShelf()
  toggleAddBookModal()
}
const removeBook = (e) => {
  console.log('removing' + e.target.parentElement.firstChild.innerText)
  library.removeBook(e.target.parentElement.firstChild.innerText)
  updateBookShelf()
  saveLocal()
}
const toggleRemoveBookModal = () => {
  removeBookModal.classList.toggle('active')
  overlay.classList.toggle('active')
  rmBookBtn.classList.toggle('active')
}
const removeModal = () => {
  overlay.classList.remove('active')
  addBookModal.classList.remove('active')
  addBookBtn.classList.remove('active')
  removeBookModal.classList.remove('active')
  rmBookBtn.classList.remove('active')
}
const toggleRead = (e) => {
  const title = e.target.parentElement.firstChild.innerText
  console.log(title)
  const book = library.getBook(title)
  console.log(library)
  book.isRead = !book.isRead
  e.target.parentElement.querySelector("#bookmark").classList.toggle('active')
  saveLocal()
}

const getBookFromInput = () => {
  const title = document.getElementById('title').value
  const author = document.getElementById('author').value
  const pages = document.getElementById('pages').value
  const isRead = document.getElementById('isRead').checked
  return new Book(title, author, pages, isRead)
}

const saveLocal = () => {
  localStorage.setItem('library', JSON.stringify(library.books))
}

const restoreLocal = () => {
  const books = JSON.parse(localStorage.getItem('library'))
  if (books) {
    library.books = books.map((book) => JSONToBook(book))
  } else {
    library.books = []
  }
}
const JSONToBook = (book) => {
  return new Book(book.title, book.author, book.pages, book.isRead)
}

addBookForm.onsubmit = addBook

overlay.onclick = removeModal
addBookBtn.onclick = toggleAddBookModal
rmBookBtn.onclick = toggleRemoveBookModal

restoreLocal()
updateBookShelf()
