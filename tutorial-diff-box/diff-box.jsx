DiffBox = {};

DiffBox._tutorials = {};

DiffBox.registerTutorial = function (tutorialName, metadata) {
  if (! Match.test(metadata, {
    gitHubRepoName: String,
    patchFilename: String
  })) {
    throw new Error("Must pass 'gitHubRepoName' and 'patchFilename' fields to DiffBox.registerTutorial.");
  }

  DiffBox._tutorials[tutorialName] = metadata;
};

Template.DiffBox.onCreated(function () {
  if (! Match.test(Template.currentData(), {
    step: String,
    tutorialName: String
  })) {
    throw new Error("Must pass 'step' and 'tutorialName' arguments to DiffBox.");
  }

  const tutorialName = Template.currentData().tutorialName;
  if (! _.has(DiffBox._tutorials, tutorialName)) {
    throw new Error(`Must call 'DiffBox.registerTutorial' with the tutorialName '${tutorialName}' first.`);
  }

  this.tutorialMetadata = DiffBox._tutorials[tutorialName];
  this.patch = StepDiffs[this.tutorialMetadata.patchFilename][Template.currentData().step];

  if (Template.currentData().filename) {
    this.filename = Template.currentData().filename;
  } else {
    const filenames = _.keys(this.patch.files);

    if (filenames.length === 1) {
      this.filename = filenames[0];
    }

    if (! this.filename) {
      throw new Error(`Multiple files in patch. Must specify filename which is one of: ${filenames.join(", ")}`);
    }
  }

  this.fileData = this.patch.files[this.filename];
});

Template.DiffBox.helpers({
  step() {
    return Template.currentData().step;
  },
  summary() {
    return Template.instance().patch.summary;
  },
  filename() {
    return Template.instance().filename;
  },
  lineNumbers() {
    const fileData = Template.instance().fileData;
    return _.range(fileData.lineNumbers.added.start,
      fileData.lineNumbers.added.start + fileData.lineNumbers.added.lines);
  },
  lines() {
    return Template.instance().fileData.lines.map((line) => {
      let highlightedContent = null;
      if (line.content) {
        const ext = _.last(Template.instance().filename.split("."));
        let fileType = ext;
        if (ext === "jsx") {
          fileType = "js";
        }

        highlightedContent = hljs.highlight(fileType, line.content, true).value;
      }

      // XXX mutating in place, but it's probably OK since the result will
      // always be the same
      line.highlightedContent = highlightedContent || " ";
      return line;
    });
  },
  equals(a, b) {
    return a === b;
  },
  gitHubLink() {
    const self = Template.instance();
    return `https://github.com/${self.tutorialMetadata.gitHubRepoName}/commit/${self.patch.sha}`;
  }
});