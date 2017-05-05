var gitPatchParser = Npm.require("git-patch-parser");

Plugin.registerCompiler(
  {
    extensions: ["multi.patch"],
    isTemplate: true
  },
  () => new MultiPatchCompiler
);

export class MultiPatchCompiler extends CachingCompiler {
  constructor() {
    super({
      compilerName: 'muttiPatch',
      defaultCacheSize: 1024*1024*10,
    });
  }
  getCacheKey(inputFile) {
    return inputFile.getSourceHash();
  }
  compileResultSize(compileResult) {
    return compileResult.length;
  }
  compileOneFile(inputFile) {
    const content = inputFile.getContentsAsString().toString('utf8');

    let results;
    try {
      let parsedData = gitPatchParser.parseMultiPatch(content);

      // Modifies array in place, sorry! -SWIM
      parsedData.forEach(parseOutStepNumberAndComment);

      const stepToPatch = {};
      parsedData.forEach(function (parsedPatch) {
        stepToPatch[parsedPatch.stepNumber] = parsedPatch;
      });

      results = "StepDiffs['" + inputFile.getPathInPackage() + "'] = " + JSON.stringify(stepToPatch) + ";\n";
    } catch (e) {
      inputFile.error({
        message: e.message,
        sourcePath: inputFile.inputPath,
        line: e.line
      });
    }

    return results;
  }
  addCompileResult(inputFile, compileResult) {
    if (!compileResult) return;

    inputFile.addJavaScript({
      path: inputFile.getPathInPackage() + '.js',
      data: compileResult,
    });
  }
}

function prepareSummary(message) {
  return capitalizeFirstLetter(message.trim());
}

function capitalizeFirstLetter(message) {
  return message.charAt(0).toUpperCase() + message.slice(1);
}

// Expects commit messages of the form:
// "Step 2.2: Replace starter HTML code"
// 
// Who knows what it does if the format is not correct
function parseOutStepNumberAndComment(parsedPatch) {
  var splitMessage = parsedPatch.message.split(":");

  if (splitMessage.length > 1) {
    var stepNumber = splitMessage[0].split(" ")[1];

    if (!stepNumber) {
      stepNumber = splitMessage[0].split(" ")[0];
    }

    parsedPatch.stepNumber = stepNumber.trim();

    if (splitMessage[1]) {
      parsedPatch.summary = prepareSummary(splitMessage[1]);
    }
  }
}

