const getNumberInString = (string) => {
    return /\d/.test(string);
};

module.exports = { getNumberInString };