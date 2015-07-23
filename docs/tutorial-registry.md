<h1>Define metadata and steps for your tutorial</h1>

To define a name, steps, and other metadata for a packaged tutorial, use the `mdg:tutorial-registry` package.

```js
api.use("mdg:tutorial-registry");
```

Now, when the package is added to a tutorial registry compatible app, it will automatically integrate by generating routes, pages, etc. for your tutorial.

### Usage for a tutorial author

1. Make your tutorial package depend on `mdg:tutorial-registry`
2. In your package code, register a tutorial in the following way:

```js
TutorialRegistry.registerTutorial({
  title: "Simple Todos React",
  subtitle: "Learn how to make a simple todo app using Meteor",
  slug: "simple-todos-react", // must be unique, used in URLs
  tutorialSourceLink: "github.com/meteor/tutorials/content/angular",
  steps: [
    {
      title: "Creating an app",
      slug: "creating-an-app", // must be unique, used in URLs
      template: "simple-todos-react-step01"
  ]
});
```

You can add additional fields, but the fields above are 

### Usage for tutorial app builder

If you want to build an app where people can submit tutorials in the form of packages, you should add the package to your app:

```sh
meteor add mdg:tutorial-registry
```

Access the dictionary of available tutorials on the `TutorialRegistry.tutorials` object.
