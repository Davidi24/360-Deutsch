// const BASE_PATH = "/models/levels/level1";
const BASE_PATH ="/models/3DObjects";

const level1 = {
  levelId: "level1",

  tasks: [
    {
      taskId: "task1",

      // Words match the 3D objects below by wordId (select a word, then click the object that matches).
      words: [
        { id: "w1", de: "der Laptop", en: "laptop" },
        { id: "w2", de: "die Uhr", en: "clock" },
        { id: "w3", de: "das Buch", en: "book" },
        { id: "w4", de: "der Stuhl", en: "chair" },
        { id: "w5", de: "das Klavier", en: "piano" },
      ],

      models: [
        { id: "m1", url: `${BASE_PATH}/pinkchair.glb`, wordId: "w4" },
        { id: "m2", url: `${BASE_PATH}/clock.glb`, wordId: "w2", cameraOrbit: "90deg 70deg 4m" },
        { id: "m3", url: `${BASE_PATH}/buch.glb`, wordId: "w3", cameraOrbit: "80deg 70deg auto" },
        { id: "m4", url: `${BASE_PATH}/Computer.glb`, wordId: "w1", cameraOrbit: "80deg 70deg auto" },
        { id: "m5", url: `${BASE_PATH}/piano.glb`, wordId: "w5", cameraOrbit: "90deg 70deg auto" },
      ],
    },
  ],

  progress: {
    completedTasks: [],
    currentTask: "task1",
    lives: 3,
    maxLives: 3,
  },

  perWordStats: {},
};

export default level1;
