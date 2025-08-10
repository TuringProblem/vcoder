import type { LanguageKey, SectionKey } from "@/types/progress"

export type LessonMetadata = {
  language: LanguageKey
  section: SectionKey
  lessonNumber: number
  title: string
  description: string
  learningPrompt: string
  initialCode?: string
  expectedOutput?: string
}

export const lessonMetadata: LessonMetadata[] = [
  // JavaScript Variables
  {
    language: "javascript",
    section: "variables",
    lessonNumber: 1,
    title: "Introduction to Variables",
    description: "Learn how to declare and use variables in JavaScript",
    learningPrompt: "Explain the difference between var, let, and const in JavaScript. When should I use each one?",
    initialCode: "let name = 'John';\nconst age = 25;\nvar city = 'New York';\n\nconsole.log(name, age, city);"
  },
  {
    language: "javascript",
    section: "variables",
    lessonNumber: 2,
    title: "Variable Scope",
    description: "Understanding block scope and function scope",
    learningPrompt: "What is the difference between block scope and function scope? How does hoisting work with different variable declarations?",
    initialCode: "function example() {\n  var x = 1;\n  let y = 2;\n  const z = 3;\n  \n  if (true) {\n    var x = 10;\n    let y = 20;\n    console.log(x, y, z);\n  }\n  \n  console.log(x, y, z);\n}\n\nexample();"
  },
  {
    language: "javascript",
    section: "variables",
    lessonNumber: 3,
    title: "Data Types",
    description: "Working with different data types in JavaScript",
    learningPrompt: "What are the primitive data types in JavaScript? How does type coercion work?",
    initialCode: "let string = 'Hello';\nlet number = 42;\nlet boolean = true;\nlet array = [1, 2, 3];\nlet object = { name: 'John' };\n\nconsole.log(typeof string);\nconsole.log(typeof number);\nconsole.log(typeof boolean);\nconsole.log(typeof array);\nconsole.log(typeof object);"
  },

  // JavaScript Conditionals
  {
    language: "javascript",
    section: "conditionals",
    lessonNumber: 1,
    title: "If Statements",
    description: "Basic conditional logic with if statements",
    learningPrompt: "How do if statements work in JavaScript? What are the different ways to write conditions?",
    initialCode: "let age = 18;\n\nif (age >= 18) {\n  console.log('You are an adult');\n} else {\n  console.log('You are a minor');\n}"
  },
  {
    language: "javascript",
    section: "conditionals",
    lessonNumber: 2,
    title: "Else If and Switch",
    description: "Multiple conditions and switch statements",
    learningPrompt: "When should I use else if vs switch statements? What are the pros and cons of each?",
    initialCode: "let grade = 'B';\n\nif (grade === 'A') {\n  console.log('Excellent!');\n} else if (grade === 'B') {\n  console.log('Good job!');\n} else if (grade === 'C') {\n  console.log('You can do better');\n} else {\n  console.log('Need improvement');\n}"
  },

  // JavaScript Loops
  {
    language: "javascript",
    section: "loops",
    lessonNumber: 1,
    title: "For Loops",
    description: "Basic iteration with for loops",
    learningPrompt: "How do for loops work? What's the difference between for, for...of, and for...in loops?",
    initialCode: "for (let i = 0; i < 5; i++) {\n  console.log('Count:', i);\n}\n\nconst fruits = ['apple', 'banana', 'orange'];\nfor (const fruit of fruits) {\n  console.log(fruit);\n}"
  },
  {
    language: "javascript",
    section: "loops",
    lessonNumber: 2,
    title: "While and Do-While",
    description: "Conditional loops with while and do-while",
    learningPrompt: "When should I use while vs do-while loops? How do I avoid infinite loops?",
    initialCode: "let count = 0;\nwhile (count < 3) {\n  console.log('While count:', count);\n  count++;\n}\n\nlet num = 0;\ndo {\n  console.log('Do-while num:', num);\n  num++;\n} while (num < 3);"
  },

  // JavaScript Functions
  {
    language: "javascript",
    section: "functions",
    lessonNumber: 1,
    title: "Function Declarations",
    description: "Creating and calling functions",
    learningPrompt: "What are the different ways to declare functions in JavaScript? What's the difference between function declarations and function expressions?",
    initialCode: "function greet(name) {\n  return 'Hello, ' + name + '!';\n}\n\nconst greetArrow = (name) => {\n  return 'Hello, ' + name + '!';\n};\n\nconsole.log(greet('John'));\nconsole.log(greetArrow('Jane'));"
  },
  {
    language: "javascript",
    section: "functions",
    lessonNumber: 2,
    title: "Arrow Functions",
    description: "Modern function syntax with arrow functions",
    learningPrompt: "What are arrow functions? When should I use them vs regular functions? What about 'this' binding?",
    initialCode: "const add = (a, b) => a + b;\nconst multiply = (a, b) => {\n  return a * b;\n};\nconst greet = name => 'Hello, ' + name;\n\nconsole.log(add(2, 3));\nconsole.log(multiply(4, 5));\nconsole.log(greet('World'));"
  },

  // TypeScript Variables
  {
    language: "typescript",
    section: "variables",
    lessonNumber: 1,
    title: "Type Annotations",
    description: "Adding types to variables in TypeScript",
    learningPrompt: "How do type annotations work in TypeScript? What are the benefits of using them?",
    initialCode: "let name: string = 'John';\nlet age: number = 25;\nlet isStudent: boolean = true;\nlet hobbies: string[] = ['reading', 'coding'];\n\nconsole.log(name, age, isStudent, hobbies);"
  },
  {
    language: "typescript",
    section: "variables",
    lessonNumber: 2,
    title: "Type Inference",
    description: "Letting TypeScript infer types automatically",
    learningPrompt: "How does TypeScript type inference work? When should I rely on it vs explicit annotations?",
    initialCode: "let message = 'Hello TypeScript';\nlet count = 42;\nlet isActive = true;\nlet numbers = [1, 2, 3, 4, 5];\n\n// TypeScript infers the types automatically\nconsole.log(typeof message);\nconsole.log(typeof count);\nconsole.log(typeof isActive);\nconsole.log(typeof numbers);"
  },

  // Python Variables
  {
    language: "python",
    section: "variables",
    lessonNumber: 1,
    title: "Python Variables",
    description: "Working with variables in Python",
    learningPrompt: "How do variables work in Python? What are the naming conventions and best practices?",
    initialCode: "name = 'Alice'\nage = 30\nis_student = True\nhobbies = ['reading', 'coding']\n\nprint(f'Name: {name}, Age: {age}')\nprint(f'Is student: {is_student}')\nprint(f'Hobbies: {hobbies}')"
  },
  {
    language: "python",
    section: "variables",
    lessonNumber: 2,
    title: "Data Types",
    description: "Understanding Python data types",
    learningPrompt: "What are the main data types in Python? How does dynamic typing work?",
    initialCode: "text = 'Hello World'\nnumber = 42\ndecimal = 3.14\nboolean = True\nmy_list = [1, 2, 3]\nmy_dict = {'name': 'John', 'age': 25}\n\nprint(f'Text: {type(text)}')\nprint(f'Number: {type(number)}')\nprint(f'Decimal: {type(decimal)}')\nprint(f'Boolean: {type(boolean)}')\nprint(f'List: {type(my_list)}')\nprint(f'Dict: {type(my_dict)}')"
  },

  // Java Variables
  {
    language: "java",
    section: "variables",
    lessonNumber: 1,
    title: "Java Variables",
    description: "Declaring variables in Java",
    learningPrompt: "How do variable declarations work in Java? What are the primitive data types?",
    initialCode: "public class Main {\n    public static void main(String[] args) {\n        String name = \"John\";\n        int age = 25;\n        double height = 1.75;\n        boolean isStudent = true;\n        \n        System.out.println(\"Name: \" + name);\n        System.out.println(\"Age: \" + age);\n        System.out.println(\"Height: \" + height);\n        System.out.println(\"Is student: \" + isStudent);\n    }\n}"
  }
]

export function getLessonMetadata(
  language: LanguageKey,
  section: SectionKey,
  lessonNumber: number
): LessonMetadata | undefined {
  return lessonMetadata.find(
    lesson =>
      lesson.language === language &&
      lesson.section === section &&
      lesson.lessonNumber === lessonNumber
  )
}

export function getLessonPrompt(
  language: LanguageKey,
  section: SectionKey,
  lessonNumber: number
): string {
  const metadata = getLessonMetadata(language, section, lessonNumber)
  return metadata?.learningPrompt || "Ask a question about this lesson..."
}
