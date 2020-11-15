const { createWorker, createScheduler, PSM, OEM } = require("tesseract.js");

const MAX_WORKERS = 3;

const processScreenshots = async (screenshot) => {
  const scheduler = createScheduler();
  const numberOfWorkers =
    screenshot.length >= MAX_WORKERS ? MAX_WORKERS : screenshot.length;
  const workers = [...Array(numberOfWorkers)].map(() =>
    createWorker({
      logger: (m) => console.log(m),
      cacheMethod: "readOnly",
    })
  );

  await Promise.all(
    workers.map(async (worker, index) => {
      await worker.load();
      await worker.loadLanguage(`eng-${index}`);
      await worker.initialize(`eng-${index}`);
      await worker.setParameters({
        tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
        tessedit_ocr_engine_mode: OEM.TESSERACT_LSTM_COMBINED,
        tessjs_create_hocr: "0",
        tessjs_create_tsv: "0",
        user_defined_dpi: "72",
      });
      scheduler.addWorker(worker);
    })
  );

  const results = await Promise.all(
    screenshot.map((screenshot) => scheduler.addJob("recognize", screenshot))
  );

  await scheduler.terminate();

  return await results;
};

module.exports = processScreenshots;
