Package.describe({
  name: 'mdg:tutorial-step-diff-compiler',
  version: '0.4.2',
  // Brief, one-line summary of the package.
  summary: 'Build plugin that parses git patches',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/meteor/tutorial-tools',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: '../docs/tutorial-step-diff-compiler.md'
});

Package.registerBuildPlugin({
  name: "mdg:tutorial-step-diffs-plugin",
  sources: ["plugin.js"],
  npmDependencies: {
    "git-patch-parser": "0.2.1"
  }
});

Package.onUse(function(api) {
  api.use('isobuild:compiler-plugin@1.0.0');
  api.addFiles('define-step-diffs.js');
  api.export("StepDiffs");
});
