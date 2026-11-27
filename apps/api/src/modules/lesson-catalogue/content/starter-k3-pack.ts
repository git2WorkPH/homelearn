import {
  CATALOGUE_PACK_ID,
  CATALOGUE_PACK_VERSION,
  LEARNING_AREAS,
  LEARNING_LEVELS,
  catalogueLessonRef,
} from "../domain/catalogue.js";
import type {
  CatalogueCoverageCell,
  CatalogueLesson,
  LearningAreaKey,
  LearningLevelKey,
} from "../domain/catalogue.js";

interface LessonSeed {
  readonly level: LearningLevelKey;
  readonly area: LearningAreaKey;
  readonly slug: string;
  readonly title: string;
  readonly strand: string;
  readonly goal: string;
  readonly activity: string;
  readonly question: string;
  readonly minutes: number;
}

const levelLabels = new Map(
  LEARNING_LEVELS.map((level) => [level.key, level.label]),
);
const areaLabels = new Map(
  LEARNING_AREAS.map((area) => [area.key, area.label]),
);
const STARTER_LEVELS = new Set<LearningLevelKey>([
  "kindergarten",
  "year-1",
  "year-2",
  "year-3",
]);
const STARTER_AREAS = new Set<LearningAreaKey>([
  "english",
  "mathematics",
  "science",
  "humanities-social-sciences",
  "technologies",
  "the-arts",
  "health-physical-education",
]);

const MATERIALS: Record<LearningAreaKey, readonly string[]> = {
  english: [
    "Paper or a writing tool",
    "A short story, picture or familiar topic",
  ],
  mathematics: [
    "Safe household objects or counters",
    "Paper and pencil (optional)",
  ],
  science: [
    "Paper and pencil",
    "A safe, family-selected object or place to observe",
  ],
  "humanities-social-sciences": [
    "Paper and pencil",
    "A public, fictional or family-approved example",
  ],
  technologies: ["Reusable household materials", "Paper for a simple plan"],
  "the-arts": [
    "Paper or reusable materials",
    "Non-toxic art materials (optional)",
  ],
  "health-physical-education": [
    "A clear, comfortable space",
    "Paper movement or scenario cards (optional)",
  ],
  languages: ["A family-selected language source or speaker"],
};

const SAFETY_AND_ACCESS: Record<LearningAreaKey, string> = {
  english:
    "Accept speaking, drawing, pointing, signing or supported communication. Use fictional examples when personal sharing is not comfortable.",
  mathematics:
    "Use familiar, safe objects. Offer larger items, a visual aid or a verbal response when handling small objects is difficult.",
  science:
    "Observe without tasting or collecting unknown items. An adult chooses a safe place and supervises outdoor observation.",
  "humanities-social-sciences":
    "Use fictional or public examples when personal or family history is not comfortable to discuss.",
  technologies:
    "Prefer reusable materials and adult-supervised tools. Unplugged options need no device or internet.",
  "the-arts":
    "Offer different ways to create and participate. Choose non-toxic materials and a clear space for movement.",
  "health-physical-education":
    "Keep movement in a clear, comfortable space and invite learners to adapt or pause. Use fictional scenarios for sensitive topics.",
  languages:
    "Choose a language and source with the family. Check pronunciation and meaning with a trusted speaker or reference.",
};

// Passage references are paired with original, child-friendly paraphrases. The
// paraphrases are not quotations and do not depend on a particular translation.
const BIBLE_CONNECTIONS: Record<
  LearningAreaKey,
  {
    readonly reference: string;
    readonly paraphrase: string;
    readonly reflectionPrompt: string;
  }
> = {
  english: {
    reference: "Proverbs 16:24",
    paraphrase:
      "The Bible teaches that kind words can encourage and comfort people.",
    reflectionPrompt:
      "How could you use words from a story or conversation to encourage someone?",
  },
  mathematics: {
    reference: "Luke 14:28",
    paraphrase:
      "Jesus used the example of counting the cost before building to show the value of planning ahead.",
    reflectionPrompt:
      "How did counting, comparing or planning help you make a careful choice?",
  },
  science: {
    reference: "Psalm 111:2",
    paraphrase:
      "The psalm celebrates taking time to notice and learn about the works of God.",
    reflectionPrompt:
      "What did you notice that made you curious about the world God made?",
  },
  "humanities-social-sciences": {
    reference: "Micah 6:8",
    paraphrase:
      "Micah teaches people to act fairly, love mercy and live humbly with God.",
    reflectionPrompt:
      "How could fairness, mercy or humility help in this place or community?",
  },
  technologies: {
    reference: "Exodus 35:31–32",
    paraphrase:
      "The story describes God-given wisdom and skill being used to design and make things.",
    reflectionPrompt:
      "How could you use your ideas and skills to make something helpful?",
  },
  "the-arts": {
    reference: "Psalm 150:4",
    paraphrase: "The psalm uses music and movement as ways to praise God.",
    reflectionPrompt:
      "What could your creative choices express about joy, gratitude or praise?",
  },
  "health-physical-education": {
    reference: "1 Timothy 4:8",
    paraphrase:
      "Paul says physical training has value, while also pointing to the importance of a life with God.",
    reflectionPrompt:
      "How can movement help you care for yourself and make room for others to join in?",
  },
  languages: {
    reference: "Proverbs 16:24",
    paraphrase:
      "The Bible teaches that kind words can encourage and comfort people.",
    reflectionPrompt:
      "How could learning or using a language help you encourage someone?",
  },
};

// Original starter ideas. These are general family activities, not official curriculum claims.
const SEEDS: readonly LessonSeed[] = [
  {
    level: "kindergarten",
    area: "english",
    slug: "story-path",
    title: "Build a story path",
    strand: "Oral language and literature",
    goal: "Retell a short story with a beginning, a change and an ending.",
    activity:
      "Draw or choose three story moments, put them in order, then retell the story with words, gestures or pictures.",
    question: "What changed between the first and last picture?",
    minutes: 20,
  },
  {
    level: "kindergarten",
    area: "english",
    slug: "first-sounds",
    title: "Listen for first sounds",
    strand: "Phonics and listening",
    goal: "Hear and compare the first sound in familiar spoken words.",
    activity:
      "Say the names of three familiar objects slowly, sort words with a similar starting sound, and find another example.",
    question: "What do you notice at the very start of those words?",
    minutes: 15,
  },
  {
    level: "kindergarten",
    area: "mathematics",
    slug: "count-and-group",
    title: "Count, group and compare",
    strand: "Number",
    goal: "Count a small collection and explain one way to group it.",
    activity:
      "Count a small collection, arrange the objects into groups, then rearrange them and check that the total stays the same.",
    question: "How could you arrange these so counting is easier?",
    minutes: 20,
  },
  {
    level: "kindergarten",
    area: "mathematics",
    slug: "shape-builders",
    title: "Build with shapes",
    strand: "Space and geometry",
    goal: "Name or describe a shape using a feature such as sides or corners.",
    activity:
      "Combine paper shapes or blocks to make a picture, then point out what is similar or different.",
    question: "What can you notice about the edges or corners?",
    minutes: 20,
  },
  {
    level: "kindergarten",
    area: "science",
    slug: "seed-watch",
    title: "Notice a seed",
    strand: "Living things and observation",
    goal: "Describe a seed using observable features and ask a question about growth.",
    activity:
      "Look closely at a dry seed, draw its visible features, and write or dictate one question to investigate later.",
    question:
      "What can you see now, and what would you need to observe over time?",
    minutes: 20,
  },
  {
    level: "kindergarten",
    area: "science",
    slug: "shadow-play",
    title: "Explore a shadow",
    strand: "Physical sciences and inquiry",
    goal: "Describe one change in a shadow after changing position.",
    activity:
      "Make a shadow in a safe place, move the object or light source, and compare the new outline.",
    question: "What did you move, and how did the shadow respond?",
    minutes: 20,
  },
  {
    level: "kindergarten",
    area: "humanities-social-sciences",
    slug: "place-map",
    title: "Draw a map of a place",
    strand: "Geography and place",
    goal: "Use a drawing or symbol to show where features are in a familiar or imaginary place.",
    activity:
      "Draw a room, park or imagined place, add a few features, then explain what a visitor could learn from the map.",
    question: "What would help someone else understand your map?",
    minutes: 20,
  },
  {
    level: "kindergarten",
    area: "humanities-social-sciences",
    slug: "then-and-now",
    title: "Compare an object then and now",
    strand: "History and change",
    goal: "Describe one similarity and difference between objects from different times.",
    activity:
      "Compare a familiar object with a public picture or description of an older example; separate what you see from what you guess.",
    question: "What can we see, and what are we guessing?",
    minutes: 20,
  },
  {
    level: "kindergarten",
    area: "technologies",
    slug: "toy-shade",
    title: "Design shade for a toy",
    strand: "Design and technologies",
    goal: "Choose a material and describe how it helps meet a design need.",
    activity:
      "Build a small cover from reusable materials, observe whether it shades a toy, then change one part and compare.",
    question: "What did your design need to do?",
    minutes: 25,
  },
  {
    level: "kindergarten",
    area: "technologies",
    slug: "picture-sequence",
    title: "Make a picture sequence",
    strand: "Digital technologies and sequencing",
    goal: "Put instructions in order and notice when a step is missing.",
    activity:
      "Arrange picture cards for a familiar task, then swap or remove one card and notice what no longer works.",
    question: "What does the character need to do first?",
    minutes: 20,
  },
  {
    level: "kindergarten",
    area: "the-arts",
    slug: "sound-to-marks",
    title: "Turn a sound into marks",
    strand: "Music and visual arts",
    goal: "Choose a mark or movement to represent something heard.",
    activity:
      "Listen to a short sound and make lines, shapes or movements that express how it feels to the learner.",
    question: "Which part of your picture or movement matches the sound?",
    minutes: 20,
  },
  {
    level: "kindergarten",
    area: "the-arts",
    slug: "shape-dance",
    title: "Make a shape dance",
    strand: "Dance and movement",
    goal: "Use two contrasting body shapes in a short movement sequence.",
    activity:
      "Make one high and one low shape in a clear space, put them in an order, and try the sequence at a comfortable pace.",
    question: "Which shape would you like someone to notice first?",
    minutes: 15,
  },
  {
    level: "kindergarten",
    area: "health-physical-education",
    slug: "movement-path",
    title: "Make a movement pathway",
    strand: "Movement and coordination",
    goal: "Follow or create a short movement sequence at a comfortable pace.",
    activity:
      "Check the space, choose three comfortable movements, and arrange them into a pathway with an option to pause.",
    question: "How can we make this movement feel comfortable and safe?",
    minutes: 15,
  },
  {
    level: "kindergarten",
    area: "health-physical-education",
    slug: "feelings-weather",
    title: "Name a feeling like weather",
    strand: "Personal and social wellbeing",
    goal: "Recognise that feelings can be described in different ways and can change.",
    activity:
      "Use a fictional character and match a feeling to a weather picture, then practise a kind response the character could offer.",
    question: "What could a supportive friend say or do?",
    minutes: 15,
  },

  {
    level: "year-1",
    area: "english",
    slug: "character-clues",
    title: "Find clues about a character",
    strand: "Reading and literature",
    goal: "Describe a character using a detail from a story as evidence.",
    activity:
      "Read a short story, name one character quality, and find a word or action that supports the idea.",
    question: "Which part of the story gave you that idea?",
    minutes: 25,
  },
  {
    level: "year-1",
    area: "english",
    slug: "clear-instructions",
    title: "Write instructions that work",
    strand: "Writing and communication",
    goal: "Present steps in an order another person can follow.",
    activity:
      "Explain a familiar, safe task in three or four steps, ask someone to follow them, then improve any unclear step.",
    question: "What did your reader need to know that you forgot to say?",
    minutes: 30,
  },
  {
    level: "year-1",
    area: "mathematics",
    slug: "number-line-walk",
    title: "Make a number-line walk",
    strand: "Number and place value",
    goal: "Place and compare numbers on a simple number line.",
    activity:
      "Label a line from zero to twenty, place number cards, and move forward or back to show a simple change.",
    question: "How does the number line show the change?",
    minutes: 25,
  },
  {
    level: "year-1",
    area: "mathematics",
    slug: "measure-treasure",
    title: "Measure with a chosen unit",
    strand: "Measurement",
    goal: "Compare two objects using the same informal unit.",
    activity:
      "Predict which of two objects is longer, measure with the same block or strip, and compare the counts.",
    question: "Why should we use the same unit for both objects?",
    minutes: 25,
  },
  {
    level: "year-1",
    area: "science",
    slug: "material-detectives",
    title: "Sort everyday materials",
    strand: "Materials and fair comparison",
    goal: "Compare materials using an observable property.",
    activity:
      "Choose a property such as flexible or smooth, observe safe materials, and sort each using the chosen rule.",
    question:
      "Would the material belong in a different group if we changed the rule?",
    minutes: 25,
  },
  {
    level: "year-1",
    area: "science",
    slug: "weather-notes",
    title: "Keep a short weather record",
    strand: "Earth and space sciences",
    goal: "Record weather observations using consistent symbols or words.",
    activity:
      "Record a few visible weather conditions from a safe place, repeat later, and compare what changed.",
    question: "Which observation changed most between the two times?",
    minutes: 15,
  },
  {
    level: "year-1",
    area: "humanities-social-sciences",
    slug: "map-key",
    title: "Make a map key",
    strand: "Geography and mapping",
    goal: "Create and use a map key for selected features.",
    activity:
      "Choose a public or imaginary place, draw three features as symbols, and make a key another person can use.",
    question: "Could someone unfamiliar with your map understand this symbol?",
    minutes: 25,
  },
  {
    level: "year-1",
    area: "humanities-social-sciences",
    slug: "needs-and-wants",
    title: "Sort needs and wants",
    strand: "Economics and choices",
    goal: "Explain one choice using the difference between a need and a want.",
    activity:
      "Sort fictional items for a made-up character and discuss how a need or want could change with the situation.",
    question: "Would the answer change in a different situation?",
    minutes: 25,
  },
  {
    level: "year-1",
    area: "technologies",
    slug: "note-carrier",
    title: "Design a note carrier",
    strand: "Design and technologies",
    goal: "Plan, make and improve a design against one simple criterion.",
    activity:
      "Make a reusable carrier for a paper note, test whether it holds or protects it, then change one feature.",
    question: "What did the test show about your design?",
    minutes: 30,
  },
  {
    level: "year-1",
    area: "technologies",
    slug: "algorithm-cards",
    title: "Give a character clear instructions",
    strand: "Digital technologies and algorithms",
    goal: "Use ordered instructions to move a character to a destination.",
    activity:
      "Draw a small grid, arrange arrow cards to make a route, and follow each instruction exactly.",
    question: "Which instruction should change to fix the route?",
    minutes: 25,
  },
  {
    level: "year-1",
    area: "the-arts",
    slug: "character-prop",
    title: "Create a character with a prop",
    strand: "Drama and visual storytelling",
    goal: "Use a design choice to communicate an imagined character quality.",
    activity:
      "Invent a character, make a simple paper prop with a chosen quality, and ask a viewer what they notice.",
    question: "What clue in the design helped the viewer guess?",
    minutes: 25,
  },
  {
    level: "year-1",
    area: "the-arts",
    slug: "rhythm-pattern",
    title: "Build a body rhythm",
    strand: "Music and pattern",
    goal: "Repeat a short sound pattern and change one part intentionally.",
    activity:
      "Choose two comfortable sounds, arrange them into a short rhythm, repeat it, then change one sound or pause.",
    question: "What helped you remember the pattern?",
    minutes: 20,
  },
  {
    level: "year-1",
    area: "health-physical-education",
    slug: "movement-circuit",
    title: "Plan a comfortable movement circuit",
    strand: "Movement and physical activity",
    goal: "Plan a short movement sequence that includes a comfortable pace or rest.",
    activity:
      "Choose three simple movements, arrange them on cards, and try the circuit with an option to adapt or pause.",
    question: "What choices help everyone take part comfortably?",
    minutes: 20,
  },
  {
    level: "year-1",
    area: "health-physical-education",
    slug: "helping-words",
    title: "Practise helpful words",
    strand: "Relationships and wellbeing",
    goal: "Choose a respectful phrase for asking for help in a fictional situation.",
    activity:
      "Act out a made-up scenario twice, using a different clear and respectful help-seeking phrase each time.",
    question: "What words make the request clear and respectful?",
    minutes: 20,
  },

  {
    level: "year-2",
    area: "english",
    slug: "fact-or-viewpoint",
    title: "Separate a fact from a viewpoint",
    strand: "Reading and critical literacy",
    goal: "Sort simple statements into checkable facts and viewpoints, explaining one choice.",
    activity:
      "Sort short statements about a familiar, low-stakes topic into “can check” and “someone’s view”, then name evidence to look for.",
    question: "What could we look at or ask to check this?",
    minutes: 25,
  },
  {
    level: "year-2",
    area: "english",
    slug: "vivid-setting",
    title: "Make a setting vivid",
    strand: "Writing and vocabulary",
    goal: "Describe a setting using specific details chosen for a reader.",
    activity:
      "List details a visitor might see or hear, write a short description, then replace general words with precise choices.",
    question: "Which word helps the reader picture the place most clearly?",
    minutes: 30,
  },
  {
    level: "year-2",
    area: "mathematics",
    slug: "growing-patterns",
    title: "Describe a growing pattern",
    strand: "Algebra and patterns",
    goal: "Describe a rule for a growing pattern and predict the next step.",
    activity:
      "Build three stages by adding a consistent amount, describe what changes, and check a prediction by building the next stage.",
    question: "What is added each time, and how do you know?",
    minutes: 25,
  },
  {
    level: "year-2",
    area: "mathematics",
    slug: "pretend-market",
    title: "Plan a pretend market",
    strand: "Money and additive thinking",
    goal: "Combine small amounts and compare a choice with a simple limit.",
    activity:
      "Set invented prices and a token limit, select objects within the limit, and check how many tokens remain.",
    question: "How can you check that your choices stay within the limit?",
    minutes: 30,
  },
  {
    level: "year-2",
    area: "science",
    slug: "map-a-habitat",
    title: "Map a small habitat",
    strand: "Biological sciences and inquiry",
    goal: "Describe one possible relationship between a living thing and its surroundings.",
    activity:
      "Observe from a respectful distance, sketch living and non-living features, and label direct observations separately from ideas.",
    question:
      "Which part did you observe directly, and which part is your idea?",
    minutes: 30,
  },
  {
    level: "year-2",
    area: "science",
    slug: "ice-observation",
    title: "Observe a change of state",
    strand: "Materials and change",
    goal: "Describe a change observed as ice warms and compare two simple conditions.",
    activity:
      "Place similar ice cubes in safe, different locations, check at agreed intervals, and record visible changes without tasting or heating.",
    question: "What did you see change, and what else could have affected it?",
    minutes: 25,
  },
  {
    level: "year-2",
    area: "humanities-social-sciences",
    slug: "source-detective",
    title: "Ask questions about a source",
    strand: "History and evidence",
    goal: "Record an observation and a question about a family-approved source.",
    activity:
      "Examine a public image or object, list visible details, then add questions the source cannot answer alone.",
    question: "What does this source not tell us?",
    minutes: 25,
  },
  {
    level: "year-2",
    area: "humanities-social-sciences",
    slug: "community-route",
    title: "Map a community route",
    strand: "Geography and connection",
    goal: "Represent a route and describe how places along it are connected.",
    activity:
      "Use two public places or an invented map, draw a route, and add features that help different people navigate.",
    question: "What would help different people use this route?",
    minutes: 30,
  },
  {
    level: "year-2",
    area: "technologies",
    slug: "protective-package",
    title: "Design a protective package",
    strand: "Design and technologies",
    goal: "Use a test result to improve a design for a stated purpose.",
    activity:
      "Make a package from reusable materials for a soft object, test with a gentle low placement, then change one feature.",
    question: "What evidence tells you the package helped?",
    minutes: 35,
  },
  {
    level: "year-2",
    area: "technologies",
    slug: "debug-a-route",
    title: "Debug a route",
    strand: "Digital technologies and algorithms",
    goal: "Find and correct an error in an ordered instruction sequence.",
    activity:
      "Follow grid directions exactly, mark where the route stops working, change one instruction, and retest.",
    question: "At which step did the instructions stop matching the goal?",
    minutes: 30,
  },
  {
    level: "year-2",
    area: "the-arts",
    slug: "mood-in-colour",
    title: "Show a mood with colour and line",
    strand: "Visual arts and interpretation",
    goal: "Choose visual elements to communicate an intended mood.",
    activity:
      "Make two small compositions with different colours or lines, then ask a viewer what they notice before explaining.",
    question: "Which choice most changed the feeling of your composition?",
    minutes: 30,
  },
  {
    level: "year-2",
    area: "the-arts",
    slug: "puppet-scene",
    title: "Tell a scene with a puppet",
    strand: "Drama and storytelling",
    goal: "Use voice, movement or position to show a character’s intention.",
    activity:
      "Use a simple puppet or object to act out an imagined problem and one choice, then try a different choice.",
    question: "What did the character want, and how could we tell?",
    minutes: 30,
  },
  {
    level: "year-2",
    area: "health-physical-education",
    slug: "cooperative-game",
    title: "Invent a cooperative game",
    strand: "Games and participation",
    goal: "Explain a rule that helps players participate fairly and safely.",
    activity:
      "Choose a shared goal, agree on simple rules, try the game, then change one rule to improve participation.",
    question: "What could we change so more people can join?",
    minutes: 25,
  },
  {
    level: "year-2",
    area: "health-physical-education",
    slug: "break-plan",
    title: "Plan a flexible activity break",
    strand: "Health and self-management",
    goal: "Choose a break activity and explain how it could support comfort or attention.",
    activity:
      "Use a fictional day to choose movement, quiet or sensory breaks for different moments and preferences.",
    question: "How could the character choose a break that works for them?",
    minutes: 20,
  },

  {
    level: "year-3",
    area: "english",
    slug: "perspective-postcard",
    title: "Write from another point of view",
    strand: "Writing and literature",
    goal: "Create a short first-person account that reflects a chosen character’s perspective.",
    activity:
      "List what an imagined character knows and notices, write a postcard about one event, then compare another character’s account.",
    question: "What might this character notice that someone else would miss?",
    minutes: 35,
  },
  {
    level: "year-3",
    area: "english",
    slug: "focused-paragraph",
    title: "Shape a paragraph for a reader",
    strand: "Writing and text structure",
    goal: "Write a paragraph with a clear main idea and related supporting details.",
    activity:
      "State one main idea, add two details that explain it, and revise any sentence that does not support the idea.",
    question:
      "Which sentence tells the reader what this paragraph is mostly about?",
    minutes: 35,
  },
  {
    level: "year-3",
    area: "mathematics",
    slug: "arrays-at-home",
    title: "Find arrays around you",
    strand: "Multiplication and arrays",
    goal: "Represent equal groups as an array and describe the total.",
    activity:
      "Arrange counters into equal rows, write or say repeated addition, then turn the array and compare.",
    question: "How does the array help you see the groups?",
    minutes: 30,
  },
  {
    level: "year-3",
    area: "mathematics",
    slug: "grid-directions",
    title: "Give directions on a grid",
    strand: "Space and location",
    goal: "Describe a route on a grid using ordered direction steps.",
    activity:
      "Mark a start and destination, write directions one square at a time, and test the route with a counter.",
    question: "Which instruction made the route easiest to follow?",
    minutes: 30,
  },
  {
    level: "year-3",
    area: "science",
    slug: "paper-glider-test",
    title: "Improve a paper glider",
    strand: "Design and scientific inquiry",
    goal: "Make a prediction, test one change and compare observations.",
    activity:
      "Fold two gliders with one changed feature, use the same safe launch point, and compare where they land.",
    question: "What did you keep the same so the comparison was useful?",
    minutes: 30,
  },
  {
    level: "year-3",
    area: "science",
    slug: "sound-and-vibration",
    title: "Notice sound and vibration",
    strand: "Physical sciences",
    goal: "Describe a connection between movement and a sound heard.",
    activity:
      "Make a gentle sound with a safe object, observe visible movement, then change one feature and compare.",
    question: "What moved when the sound happened?",
    minutes: 25,
  },
  {
    level: "year-3",
    area: "humanities-social-sciences",
    slug: "place-change",
    title: "Show how a place changes",
    strand: "History and geography",
    goal: "Describe a change in a place and identify evidence for it.",
    activity:
      "Compare public images or descriptions from different times, list what changed, and connect one idea to a visible detail.",
    question: "Which detail in the source supports your idea?",
    minutes: 30,
  },
  {
    level: "year-3",
    area: "humanities-social-sciences",
    slug: "community-decision",
    title: "Make a fair community decision",
    strand: "Civics and participation",
    goal: "Compare viewpoints and explain a decision using a stated reason.",
    activity:
      "Use a fictional community question, list needs from two viewpoints, compare options, and explain a trade-off.",
    question: "Whose needs have we considered, and whose might we have missed?",
    minutes: 30,
  },
  {
    level: "year-3",
    area: "technologies",
    slug: "bridge-design",
    title: "Build and improve a bridge",
    strand: "Engineering design",
    goal: "Explain how a design change affects a chosen performance measure.",
    activity:
      "Build a short-span bridge with reusable materials, test gently with soft weights, change one feature and compare.",
    question: "What changed between the first and second test?",
    minutes: 40,
  },
  {
    level: "year-3",
    area: "technologies",
    slug: "paper-screen",
    title: "Sketch a helpful screen",
    strand: "Design and digital technologies",
    goal: "Use feedback from a simple user check to improve a design.",
    activity:
      "Sketch two paper screens for a fictional task, ask someone to find the next step, and revise one unclear choice.",
    question: "What did your tester expect to happen next?",
    minutes: 35,
  },
  {
    level: "year-3",
    area: "the-arts",
    slug: "sound-collage",
    title: "Compose a sound collage",
    strand: "Music and composition",
    goal: "Organise sounds to create a deliberate effect for a listener.",
    activity:
      "Choose a theme, arrange three or four safe sounds into a sequence, then ask a listener what they noticed first.",
    question: "What did a repeated sound or pause add?",
    minutes: 30,
  },
  {
    level: "year-3",
    area: "the-arts",
    slug: "message-poster",
    title: "Design a poster with a clear message",
    strand: "Visual communication",
    goal: "Use layout choices to make a message easy to find.",
    activity:
      "Invent a friendly event, arrange a title, image and short detail, then ask a viewer what they noticed first.",
    question: "Was the first thing your viewer noticed what you intended?",
    minutes: 35,
  },
  {
    level: "year-3",
    area: "health-physical-education",
    slug: "adapt-a-game",
    title: "Adapt a game for more players",
    strand: "Movement and inclusion",
    goal: "Explain how a rule change affects participation and safety.",
    activity:
      "Change one rule in a familiar low-contact game, try the new version, and discuss who can participate more easily.",
    question: "Who could join more easily after that change?",
    minutes: 25,
  },
  {
    level: "year-3",
    area: "health-physical-education",
    slug: "safe-next-step",
    title: "Choose a safe next step",
    strand: "Safety and decision-making",
    goal: "Explain one safe next step in a low-stakes fictional scenario.",
    activity:
      "Choose a made-up public-place scenario, compare safe choices, and identify a trusted adult in that fictional setting.",
    question: "What information would the character need before choosing?",
    minutes: 25,
  },
];

function createLesson(seed: LessonSeed): CatalogueLesson {
  const levelLabel = levelLabels.get(seed.level);
  const learningArea = areaLabels.get(seed.area);
  if (levelLabel === undefined || learningArea === undefined)
    throw new Error("INVALID_STARTER_PACK_REFERENCE");
  const id = `${seed.level}:${seed.area}:${seed.slug}`;
  const lesson = {
    id,
    packId: CATALOGUE_PACK_ID,
    packVersion: CATALOGUE_PACK_VERSION,
    levelKey: seed.level,
    levelLabel,
    learningAreaKey: seed.area,
    learningArea,
    strand: seed.strand,
    title: seed.title,
    summary: seed.activity,
    learningGoal: seed.goal,
    successCriteria: Object.freeze([
      seed.goal,
      "Share or show one choice made during the activity.",
    ]),
    materials: Object.freeze([...MATERIALS[seed.area]]),
    estimatedMinutes: seed.minutes,
    steps: Object.freeze([
      `Bible connection: read ${BIBLE_CONNECTIONS[seed.area].reference} in a Bible your family uses, or share the original paraphrase in the Bible connection below.`,
      `Read the activity together and gather the safe materials you need. ${seed.activity}`,
      `Reflect together: ${BIBLE_CONNECTIONS[seed.area].reflectionPrompt}`,
      "Review what happened and invite the learner to share one observation or choice.",
    ]),
    support:
      seed.level === "kindergarten"
        ? "Use objects, pictures and shared talk; shorten the activity or let the learner show an answer without writing."
        : "Break the activity into short steps, use a visual example, or let the learner explain an answer aloud.",
    extension:
      "Invite the learner to make a second version, compare both attempts and explain which evidence supports their choice.",
    parentPrompt: seed.question,
    bibleConnection: BIBLE_CONNECTIONS[seed.area],
    safetyAndAccess: SAFETY_AND_ACCESS[seed.area],
    provenance: "Original HomeLearn starter content",
    editorialStatus: "needs-parent-review",
    jurisdictionMapping: null,
  } satisfies Omit<CatalogueLesson, "reference">;
  return Object.freeze({ ...lesson, reference: catalogueLessonRef(lesson) });
}

export const STARTER_K3_LESSONS: readonly CatalogueLesson[] = Object.freeze(
  SEEDS.map(createLesson),
);

export const STARTER_K3_COVERAGE: readonly CatalogueCoverageCell[] =
  Object.freeze(
    LEARNING_LEVELS.flatMap((level) =>
      LEARNING_AREAS.map((area) => {
        const matchingLessons = STARTER_K3_LESSONS.filter(
          (lesson) =>
            lesson.levelKey === level.key &&
            lesson.learningAreaKey === area.key,
        );
        const inScope =
          STARTER_LEVELS.has(level.key) && STARTER_AREAS.has(area.key);
        return Object.freeze({
          levelKey: level.key,
          levelLabel: level.label,
          learningAreaKey: area.key,
          learningArea: area.label,
          targetLessonCount: inScope ? 2 : 0,
          draftLessonCount: matchingLessons.length,
          reviewedLessonCount: 0,
          status:
            matchingLessons.length > 0
              ? ("needs-parent-review" as const)
              : ("not-in-starter-pack" as const),
        });
      }),
    ),
  );
