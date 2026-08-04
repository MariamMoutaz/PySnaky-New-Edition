// PySnaky lesson content, six lessons, each with explanation text,
// runnable code examples, and a short quiz.

const LESSONS = [
  {
    id: "variables",
    title: "1. Variables & print()",
    intro: "A variable is a name attached to a value. <code>print()</code> is how your program talks back to you.",
    body: `
      <p>When you write <code>age = 25</code>, Python stores the number 25 under the name <code>age</code>. You can reuse that name anywhere below it in your code, and its value can change later on.</p>
      <p><code>print()</code> writes whatever you pass it to the screen. Give it several things separated by commas and it prints them all on one line, separated by spaces.</p>
    `,
    examples: [
      {
        title: "Basic variables",
        code: `name = "Mariam"
age = 21
gpa = 3.8

print("Name:", name)
print("Age:", age)
print("GPA:", gpa)`
      },
      {
        title: "Reassigning a variable",
        code: `score = 10
print("Starting score:", score)

score = score + 5
print("After bonus:", score)`
      }
    ],
    quiz: [
      {
        q: "What does <code>x = 5</code> do?",
        options: ["Compares x to 5", "Creates a variable x holding 5", "Prints the number 5"],
        correct: 1
      },
      {
        q: "Which line correctly prints two values on one line?",
        options: [`print("Age" age)`, `print("Age", age)`, `print["Age", age]`],
        correct: 1
      },
      {
        q: "After <code>score = 10</code> then <code>score = score + 5</code>, what is <code>score</code>?",
        options: ["10", "5", "15"],
        correct: 2
      }
    ]
  },
  {
    id: "strings",
    title: "2. Strings & f-strings",
    intro: "Text in Python lives in strings — and f-strings are the clean way to mix text with variables.",
    body: `
      <p>A string is text wrapped in quotes: <code>"hello"</code> or <code>'hello'</code>. You can glue strings together with <code>+</code>, or measure them with <code>len()</code>.</p>
      <p>The easier way to build a sentence out of variables is an f-string: put <code>f</code> right before the opening quote, and drop variables inside <code>{ }</code>.</p>
    `,
    examples: [
      {
        title: "Joining strings",
        code: `first = "Py"
second = "Snaky"

full = first + second
print(full)
print("Length:", len(full))`
      },
      {
        title: "f-strings",
        code: `user = "Mariam"
lessons_done = 2

print(f"Welcome back, {user}!")
print(f"You've finished {lessons_done} lessons so far.")`
      }
    ],
    quiz: [
      {
        q: "What symbol starts an f-string?",
        options: ["f", "s", "%"],
        correct: 0
      },
      {
        q: "What does <code>len(\"Python\")</code> return?",
        options: ["5", "6", "7"],
        correct: 1
      },
      {
        q: "What does <code>f\"Hi {user}\"</code> do when <code>user = \"Mariam\"</code>?",
        options: [`Prints "Hi {user}" literally`, `Prints "Hi Mariam"`, "Raises an error"],
        correct: 1
      }
    ]
  },
  {
    id: "conditionals",
    title: "3. Conditionals",
    intro: "if / elif / else let your program choose what to do based on a condition.",
    body: `
      <p><code>if</code> runs a block only when its condition is true. Add <code>elif</code> for another condition to check, and <code>else</code> for a fallback when nothing above matched.</p>
      <p>Comparisons like <code>&gt;</code>, <code>&lt;</code>, and <code>==</code> (equals) produce <code>True</code> or <code>False</code> — that's what the condition actually evaluates to.</p>
    `,
    examples: [
      {
        title: "Grading a score",
        code: `score = 82

if score >= 90:
    print("Grade: A")
elif score >= 75:
    print("Grade: B")
else:
    print("Grade: C")`
      },
      {
        title: "Even or odd",
        code: `number = 7

if number % 2 == 0:
    print(number, "is even")
else:
    print(number, "is odd")`
      }
    ],
    quiz: [
      {
        q: "Which keyword provides a fallback when no condition above matched?",
        options: ["elif", "else", "default"],
        correct: 1
      },
      {
        q: "What does <code>number % 2 == 0</code> check?",
        options: ["If number is negative", "If number is even", "If number is zero"],
        correct: 1
      },
      {
        q: "Given <code>score = 82</code> in the grading example, what prints?",
        options: ["Grade: A", "Grade: B", "Grade: C"],
        correct: 1
      }
    ]
  },
  {
    id: "loops",
    title: "4. Loops",
    intro: "for and while loops repeat a block of code so you don't repeat yourself.",
    body: `
      <p>A <code>for</code> loop walks through a sequence — like <code>range(5)</code>, which counts 0 through 4 — running its block once per item.</p>
      <p>A <code>while</code> loop keeps running as long as its condition stays true, which makes it useful when you don't know in advance how many times you'll repeat.</p>
    `,
    examples: [
      {
        title: "Counting with range()",
        code: `for i in range(5):
    print("Count:", i)`
      },
      {
        title: "A simple while loop",
        code: `charges = 3

while charges > 0:
    print("Firing! Charges left:", charges)
    charges = charges - 1

print("Out of charges.")`
      }
    ],
    quiz: [
      {
        q: "How many times does <code>for i in range(5):</code> run its block?",
        options: ["4", "5", "6"],
        correct: 1
      },
      {
        q: "A while loop keeps running until...",
        options: ["its condition becomes false", "it runs exactly 10 times", "the program ends"],
        correct: 0
      },
      {
        q: "In the charges example, what's the last line printed before 'Out of charges.'?",
        options: ["Firing! Charges left: 0", "Firing! Charges left: 1", "Firing! Charges left: 3"],
        correct: 1
      }
    ]
  },
  {
    id: "lists",
    title: "5. Lists",
    intro: "A list holds an ordered collection of values that you can loop over, index into, and grow.",
    body: `
      <p>Lists are written with square brackets: <code>fruits = ["apple", "banana", "cherry"]</code>. Each item has a position starting at 0, so <code>fruits[0]</code> is <code>"apple"</code>.</p>
      <p><code>.append()</code> adds an item to the end, and a <code>for</code> loop over a list gives you each item in order without needing an index.</p>
    `,
    examples: [
      {
        title: "Indexing a list",
        code: `fruits = ["apple", "banana", "cherry"]

print(fruits[0])
print(fruits[2])
print("Total fruits:", len(fruits))`
      },
      {
        title: "Looping and appending",
        code: `skills = ["Python", "Java"]
skills.append("JavaScript")

for skill in skills:
    print("Skill:", skill)`
      }
    ],
    quiz: [
      {
        q: "In <code>fruits = [\"apple\", \"banana\", \"cherry\"]</code>, what is <code>fruits[1]</code>?",
        options: ["apple", "banana", "cherry"],
        correct: 1
      },
      {
        q: "What does <code>.append()</code> do to a list?",
        options: ["Removes the first item", "Adds an item to the end", "Sorts the list"],
        correct: 1
      },
      {
        q: "What does <code>len(fruits)</code> return for a 3-item list?",
        options: ["2", "3", "4"],
        correct: 1
      }
    ]
  },
  {
    id: "functions",
    title: "6. Functions",
    intro: "A function packages up a block of code you can reuse, with a name and its own inputs.",
    body: `
      <p><code>def</code> defines a function. Anything inside its parentheses is a parameter — a value the function expects to receive each time you call it.</p>
      <p><code>return</code> sends a value back out of the function so you can store it or print it, instead of just printing inside the function itself.</p>
    `,
    examples: [
      {
        title: "Defining and calling a function",
        code: `def greet(name):
    print("Hello,", name, "!")

greet("Mariam")
greet("PySnaky")`
      },
      {
        title: "A function that returns a value",
        code: `def square(number):
    return number * number

result = square(6)
print("6 squared is", result)`
      }
    ],
    quiz: [
      {
        q: "Which keyword starts a function definition?",
        options: ["func", "def", "function"],
        correct: 1
      },
      {
        q: "What does <code>return</code> do that <code>print()</code> doesn't?",
        options: ["Sends a value back for later use", "Displays text on screen", "Deletes a variable"],
        correct: 0
      },
      {
        q: "What does <code>square(6)</code> return, given the example function?",
        options: ["12", "36", "6"],
        correct: 1
      }
    ]
  }
];
