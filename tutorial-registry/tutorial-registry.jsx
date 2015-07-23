TutorialRegistry = {
  _tutorials: {},

  registerTutorial(slug, metadata) {
    check(slug, String);
    check(metadata, {
      title: String,
      subtitle: String,
      tutorialSourceLink: Match.Optional(String),
      tutorialCodeRepositoryLink: Match.Optional(String),
      steps: [
        {
          title: String,
          slug: String,
          template: String
        }
      ]
    });

    TutorialRegistry._tutorials[name] = metadata;
  },

  getTutorial(slug) {
    return TutorialRegistry._tutorials[slug];
  }
};
