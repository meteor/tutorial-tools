<h1>Building a tutorial viewer app</h1>

Since tutorials can be distributed as Meteor packages, it is possible to create a wide variety of tutorial viewing and reading apps with different styles, features, and layouts. Some ideas:

1. Single page print layout
2. Speed reading layout
3. Gamified tutorial system with badges and points

### Example app

For a quick example of a simple tutorial viewer app, check out the `tutorial-viewer` example app: XXX

### Step-by-step guide

When someone publishes a tutorial as a Meteor package, they will depend on the `mdg:tutorial-registry` package. This package provides a standard API for a tutorial to provide its content to an enclosing app. It's up to you to convert that metadata and content into routes, layouts, sidebars, and whatever other chrome your app needs.

#### 1. Add the tutorial registry package

```sh
meteor add mdg:tutorial-registry
```

#### 2. Add the desired tutorial as a package

Here is how you would add a tutorial package to your tutorial viewer app:

```sh
meteor add mdg:simple-todos-tutorial
```

This will include all of the content for the standard Meteor simple-todos tutorial from meteor.com.

#### 2. Access the metadata

If you run your app, you should be able to access the `TutorialRegistry.tutorials` object from the console. At this point, it should have one key: "simple-todos", which contains all of the metadata for that tutorial.

#### 3. Convert the metadata into routes

// XXX should this be a tutorial???? is this self-hosting yet..