Package.describe({
  name: 'mdg:tutorial-diff-box',
  version: '0.3.2',
  // Brief, one-line summary of the package.
  summary: 'A template to display parsed Git diffs as code snippets',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/meteor/tutorial-tools',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: '../docs/tutorial-diff-box.md'
});

Package.onUse(function(api) {
  api.use([
    "templating",
    "jsx@0.1.5",
    "less",
    'check'
  ]);

  api.use([
    "simple:highlight.js@1.0.9",
    'mdg:tutorial-step-diff-compiler@0.2.1'
  ]);

  api.versionsFrom('1.2');
  api.addFiles('diff-box.html');
  api.addFiles('diff-box.less');
  api.addFiles('diff-box.jsx', "client");

  api.export("DiffBox");
});
