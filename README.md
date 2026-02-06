# Odin Projects Assignments

A selection of assignments from the amazing resource that is [The Odin Project](https://www.theodinproject.com/)

:warning: I haven't spent a huge amount of effort optimising for mobile but it shouldn't be too bad even on small screens.

## TaskBoy2000

Fallout-inspired task-management app written in vanilla TS. It doesn't use any 3rd party libraries.

:warning: The rendering jankiness is a feature and can be turned off in settings. I just think it kinda matches the old CRT aesthetic. ¯\\_(ツ)_/¯

### :rocket: Features

- Create projects (quests) and assign tasks to them
- Set deadlines to tasks/projects
- Set task priority, mark it as completed
- Order of user's projects can be reordered on drag
- View Today's/project tasks (sensibly ordered)
- Dialog boxes can be dragged around the screen: Position is remembered for the session
- Change theme in Settings
- Projects/tasks/settings persist in the browser's local storage

### :book: Main learning objectives

- Practice SOLID design
- Implement smooth and sensible UI

:desktop_computer: [Live preview](https://mivalek.github.io/static/odin/task_boy/)

## Restaurant

Dine in Valhalla! (not really, though) Minimal SPA with a basic router.

### :book: Main learning objectives

- learn ES6 modules
- use webpack to build the app
- implement basic SPA routing

:desktop_computer: [Live preview](https://mivalek.github.io/static/odin/restaurant/)

## Tic Tac Toe

Play a game (or several) of Tic Tac Toe. Choose your own board size.

### :book: Main learning objectives

- learn the Immediately Invoked Function Expression (IIFE) module pattern
- Expose as few global variables as you can

:desktop_computer: [Live preview](https://mivalek.github.io/static/odin/tictactoe/)

## Library

Add and remove your books to the library an mark them as read or unread. No persistent storage is implemented but it's trivial with `localStorage`.

:desktop_computer: [Live preview](https://mivalek.github.io/static/odin/library/)

### :book: Main learning objectives

- learn object constructors
- use HTML `<form>` inside a `<dialog> to add items
- implement basic interactivity (add, remove, mark un/read)
