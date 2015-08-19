<h1>Git patch compiler for generating code snippets</h1>

To generate code snippet metadata from a Git repository, use the `mdg:tutorial-step-diff-compiler` package.

```sh
meteor add mdg:tutorial-step-diff-compiler
```

This Meteor build plugin compiles git patch files so that they can be used to display code snippets in a tutorial.

### Usage

1. Add this package to your app.
2. Generate a file with a `.multi.patch` extension and add it to your app or package, generated using the method described in the next section.
3. Launch the app. In the browser console, you will be able to access the data on the `StepDiffs` object.

### Data structure

You get a nested data structure on the client that has all of the patch files that were built. Inside each patch file, there is a series of steps, identified by step number as described in "Commit message format" below. Inside each step, there is some metadata and a series of files, identified by file name. Inside each file, there is some metadata about the number of lines changed, and then a series of lines. Each line has a type: `added`, `removed`, or `context`, and a `content` field which is the actual line of code.

```js
{
  "simple-todos.multi.patch": {
    "1": {
      "stepNumber": "1",
      "sha": "d7a5e7f791c6f6",
      "summary": "Run `meteor create`",
      "message": "Step 1: Run `meteor create`",
      "files": {
        "simple-todos.html": [
          {
            "lineNumbers": {
              "added": {
                "lines": 14,
                "start": 1
              },
              "removed": {
                "lines": 0,
                "start": 0
              }
            },
            "lines": [
              {
                "content": "<head>",
                "type": "added"
              },
              // ... more lines here
            ]
          }
          // .. could be multiple items if the patch has more parts
        ]
        // ... more files here
      }
    }
    // ... more steps here
  }
}
```

### Commit message format

For this build plugin to parse the step number of the commit, your commit messages should be in the following format:

```
Step 3.1: Add a new function to my app
```

### Creating a `.multi.patch` file

If you have a Git repository with a series of commits, you can create a single file that describes all of the commits by running the following command:

```sh
git format-patch --stdout $(git log --pretty=format:%H|tail -1) > tutorial.multi.patch
```

This looks a lot like the result of `git show`, but for every commit in the repository since the first one. The `mdg:tutorial-step-diff-compiler` package knows how to parse this file and give you all of the necessary data in a JavaScript data structure.
