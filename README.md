# PySnaky

PySnaky is an interactive browser-based tool for learning Python fundamentalsو You read a short explanation, test the code directly in the browser, and verify your understanding through quizzes.

## What's inside

Six structured lessons covering core concepts:

- variables & print()
- strings & f-strings
- Conditionals (if / elif / else)
- Loops (for & while)
- lists
- functions

Each lesson includes executable code examples and a checkpoint quiz. A snake-shaped progress tracker lights up as you pass each lesson, with state saved in localStorage.


## How the Code Runner Works

The app runs entirely on the client side with no backend interpreter:

- script.js: uses a custom transpire to map the Python syntax in lessons-data.js into standard JavaScript.
- Code executes inside a sandboxed Function() scope, capturing standard output to display print() statements.
- Supported syntax includes variables, arithmetic, string operations, f-strings, conditionals, loops, basic list methods (.append(), len()), and function returns.

 Note: The transpiler is custom-built for the syntax patterns used in these specific lessons, Adding new language features (such as dictionaries or error handling) requires updating the parsing rules in script.js.



## Project Structure
text
pysnaky/
├── index.html         # Main interface & views (Home, Lessons, Quiz, About)
├── style.css          # Design system & styles
├── script.js          # App state, progress tracking, and JS transpiler
└── lessons-data.js    # Lesson content, code examples, and quiz data
