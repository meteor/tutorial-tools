<h1>Meteor tutorial tools</h1>

A set of handy dandy tools that you can use to make a maintainable step-by-step coding tutorial with a great user experience.

It's not just a set of packages - it's also a workflow for creating, maintaining, and distributing tutorials.

### Example

These tools are used to produce and maintain the official Meteor tutorials at [meteor.com/tutorials](https://www.meteor.com/tutorials/blaze/creating-an-app).

### List of tools

1. `tutorial-diff-box` - A Meteor template called `DiffBox` that can display a parsed Git diff as a code snippet.
2. `tutorial-step-diff-compiler` - A Meteor build plugin that parses Git patch files so that they can be displayed by `DiffBox`
3. `tutorial-registry` - A package that provides a standard API for specifying tutorial metadata.

### Problems this is solving

1. **Consistency between steps** - In a step-by-step tutorial where you are editing a piece of code incrementally, it can be hard to keep all of the steps consistent and conflict-free. In this workflow, this problem is solved by keeping all of the code snippets in a git repository so that conflicts are automatically identified and resolved.
2. **Helpful code snippets with context** - If you put all of your code snippets in regular markdown code fences, you have to put a lot of text and comments around it to tell the person following along where the code should go. The solution is to automatically generate a user-friendly and contextful code snippet box from a Git repository.
3. **Maintaining a companion GitHub repository** - If someone gets stuck while following the tutorial, it's great to have an escape hatch. In this case, we can easily provide a link to a GitHub repository with commits and diffs for every step. The reader can even check out this repository and run the code for any step without having to type anything for themselves.
4. **Tutorial distribution** - Ideally, if you want to make a tutorial, you don't have to start from scratch and build all of the features a good tutorial should have yourself. By packaging tutorials as Meteor packages, we can import them into any number of different tutorial viewers and environments. This can be the basis for a community-oriented tutorial hub where new tutorials can simply be submitted as Meteor packages.

