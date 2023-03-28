class Cell {
    #value
    #readOnly = false;

    isWrong = false;
    #row;
    #col;
    static EMPTY = '.'
    constructor(row, col, value = Cell.EMPTY, readOnly) {
        this.#value = value
        this.#row = row
        this.#col = col
        this.#readOnly = readOnly
    }

    setWrong = (isWrong) => {
        this.isWrong = isWrong
    }

    getIsWrong = () => {
        return this.isWrong
    }

    editValue = (value, readOnly) => {
        this.#readOnly = readOnly
        this.#value = value
    }

    getValue = () => {
        return this.#value
    }

    getReadOnly = () => {
        return this.#readOnly
    }
}
export default Cell