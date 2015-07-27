TutorialRegistry = {
  tutorials: {},

  registerTutorial(slug, metadata) {
    check(slug, String);
    check(metadata, Match.ObjectIncluding({
      title: String,
      subtitle: String,
      tutorialSourceLink: Match.Optional(String),
      steps: [
        Match.ObjectIncluding({
          title: String,
          slug: String,
          template: String
        })
      ]
    }));

    TutorialRegistry.tutorials[slug] = metadata;
  }
};
