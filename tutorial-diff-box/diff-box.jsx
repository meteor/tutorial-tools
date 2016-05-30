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

function escapeHtml(unsafe) {
  return unsafe
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}

function createError(msg, step) {
  if (!step) {
    return new Error(msg);
  }

  return new Error(`Step ${Template.currentData().step}: ${msg}`);
}

Template.DiffBox.onCreated(function () {
  if (! Match.test(Template.currentData(), {
    step: String,
    tutorialName: String,
    filename: Match.Optional(String)
  })) {
    throw createError('Must pass \'step\' and \'tutorialName\' arguments to DiffBox.');
  }

  const tutorialName = Template.currentData().tutorialName;
  if (! _.has(DiffBox._tutorials, tutorialName)) {
    throw createError(`Must call 'DiffBox.registerTutorial' with the tutorialName '${tutorialName}' first.`);
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
      throw createError(`Multiple files in patch. Must specify filename which is one of: ${filenames.join(", ")}`, true);
    }
  }

  this.fileSections = this.patch.files[this.filename];
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
    const fileSections = Template.instance().fileSections;
    const lineRanges = fileSections.map((section) => {
      return _.range(section.lineNumbers.added.start,
        section.lineNumbers.added.start + section.lineNumbers.added.lines);
    });

    return lineRanges.reduce((prev, curr) => {
      if (prev) {
        return prev.concat(" ").concat(curr);
      } else {
        return curr;
      }
    }, null);
  },
  lines() {
    const fileSections = Template.instance().fileSections;
    const sectionLines = fileSections.map((section) => {
      return section.lines.map((line) => {
        let highlightedContent = null;
        if (line.content) {
          const ext = _.last(Template.instance().filename.split("."));
          let fileType = ext;
          if (ext === "jsx") {
            fileType = "js";
          } else if (ext === "less") {
            fileType = "css";
          }

          if (hljs.getLanguage(fileType)) {
            // XXX there is no need for replacing < > and &
            // because hljs does that
            highlightedContent =
              hljs.highlight(fileType, line.content, true).value;
          } else {
            highlightedContent = escapeHtml(line.content);
          }
        }

        // XXX mutating in place, but it's probably OK since the result will
        // always be the same
        line.highlightedContent = highlightedContent || " ";

        return line;
      });
    });

    return sectionLines.reduce((prev, curr) => {
      if (prev) {
        return prev.concat({ highlightedContent: "<span class='hljs-comment'>...some lines skipped...</span>" }).concat(curr);
      } else {
        return curr;
      }
    }, null);
  },
  equals(a, b) {
    return a === b;
  },
  gitHubLink() {
    const self = Template.instance();
    return `https://github.com/${self.tutorialMetadata.gitHubRepoName}/commit/${self.patch.sha}`;
  }
});
