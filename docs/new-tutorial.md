<h1>Workflow for creating a new tutorial (Incomplete)</h1>

Here are some step-by-step directions for creating a tutorial using the tools we have built for the Meteor tutorial. This is how we built all of the tutorials we have now.

Keep in mind that the creation process might be a little more work than usual, but the benefits will really pay off in maintenance. If any of the packages or APIs that you are using in your tutorial change, it will be easy to update it with new code or content.

> Yes, it is somewhat ironic that this is a tutorial, and it doesn't use the tutorial tools. I might fix that in the future.

### 1. Create a git repository with step-by-step code

If your tutorial is about how to build a certain kind of app or use a certain package, the core of the content will consist of code. This code is most reasonably represented as a git repository.

**Labeling commits with step numbers:** To make it easy to display all of the code snippets, make each change a separate commit. You should number the steps and changes in your commit messages, like this:

```
Step 4.2: Add event handler for form submit
```

**Keep commits as small as possible:** If you change multiple files in one step, you should split them into sub-steps for easier inclusion. For an example, see the [official Meteor tutorials](https://github.com/meteor/tutorials).

**Initial files:** Keep in mind that you will not be able to display a code snippet for the initial commit, so you should make it as basic as possible - possibly just a readme, or initial generated files.

### 2. Create a patch file for your repository

Now that you have all of the code changes in a git repository, go into that repository and run a git command to generate a patch file:

```sh
git format-patch --stdout $(git log --pretty=format:%H|tail -1) > tutorial.multi.patch
```

This basically generates a file that contains a serialized representation of every commit in your repository, starting from the first one.

### 3. Make an app to display your tutorial

Let's start with a basic Meteor app.

```sh
meteor create my-tutorial-viewer
cd my-tutorial-viewer
meteor
```

### 3. Make a package to contain your tutorial

It is beneficial to develop your tutorial as a Meteor package. This will allow it to be integrated into different tutorial viewer apps, and to be shared through Atmosphere. You can create a package by running the following command:

```
meteor create --package username:my-tutorial-name
```

Inside your `package.js` file, declare dependencies on the tutorial-tools packages:

```js
api.use([
  'mdg:tutorial-step-diff-compiler@0.1.0',
  'mdg:tutorial-diff-box@0.1.1',
  'mdg:tutorial-registry@0.1.1'
]);
```

Also, make sure to include the patch file you generated above:

```js
api.addFiles([
  "tutorial.multi.patch"
]);
```

### 4. Include code snippets in your tutorial content with DiffBox

Create a template with some tutorial content:

```html
<template name="myTutorialStep01">
  <h1>Step 1: Do some stuff</h1>

  <p>In this step, we will do some nice things.</p>

  {{> DiffBox step="1.1" tutorialName="my-tutorial"}}
</template>
```

You might notice that the diff box doesn't work yet. You need to register some metadata about your tutorial:

```js
// Somewhere in your package, in client-only code
DiffBox.registerTutorial("my-tutorial", {
  gitHubRepoName: "username/my-tutorial-code",
  patchFilename: "tutorial.multi.patch"
});
```

Now, you should be able to see a nice code diff box, with a link to the relevant commit on GitHub.

### 5. Specifying tutorial metadata with TutorialRegistry

In the hopes of one day having a tutorial hub where we can host many different community tutorials, I have created a package called `mdg:tutorial-registry` that defines a standard API between a tutorial viewer app and a tutorial package. To use the tutorial registry package, you need the app and the package to both depend on it.

In the tutorial package, define some metadata about the tutorial:

```js
TutorialRegistry.registerTutorial({
  title: "My Awesome Tutorial",
  subtitle: "Learn how to do things",
  slug: "my-tutorial",
  tutorialSourceLink: "github.com/username/my-tutorial-content",
  steps: [
    {
      title: "Do some stuff",
      slug: "do-some-stuff",
      template: "myTutorialStep01"
    }
    // ... more steps
  ]
});
```

In the tutorial viewer app, the tutorial metadata can now be found in a standard form on the `TutorialRegistry.tutorials` object.
