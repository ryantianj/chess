const { createWorker, createScheduler } = require('tesseract.js');




const driver = async (image, croppedAreaPixels, getProgress) => {
    const width = croppedAreaPixels.width / 9
    const height = croppedAreaPixels.height / 9

    const rectangles = []
    const error = 0.15
    for (let i = 0; i < 9; i++) {
        const row = []
        for (let j = 0; j < 9; j++) {
            row.push({
                left: j * width + error * width,
                top: i * height + error* height,
                width: (1- error) * width,
                height: (1- error) * height
            })
        }
        rectangles.push(row)
    }

    const doOCR = async (getProgress) => {
        // TODO: make parallel

        // const start = performance.now();
        const numWorkers = 2

        const worker = createWorker()
        await worker.load();
        await worker.loadLanguage('eng');
        await worker.initialize('eng');
        await worker.setParameters({
            tessedit_char_whitelist: '123456789',
        });

        const values = []
        let count = 0
        for (let i = 0; i < 9; i++) {
            const row = []
            for (let j = 0; j < 9; j++) {
                const { data: { text } } = await worker.recognize(image, {rectangle: rectangles[i][j]});
                count++
                getProgress(count / 81)
                row.push(text)
            }
            values.push(row)
        }
        await worker.terminate()
        cleanValues(values)
        // const end = performance.now();
        // const duration = end - start;
        // console.log("time", duration)
        return values
    };
    return await doOCR(getProgress)
}

const cleanValues = (array) => {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const current = array[i][j]
            const cleaned = current.replaceAll("\n", "").trim()
            if (cleaned === '' || parseInt(cleaned) < 1 || parseInt(cleaned) > 9) {
                array[i][j] = '.'
            } else {
                array[i][j] = cleaned
            }
        }
    }
}

export default driver