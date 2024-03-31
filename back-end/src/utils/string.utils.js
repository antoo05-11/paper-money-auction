export const isNumberInRange = (input, lowerThreshold, upperThreshold) => {
    let number = parseInt(input);
    if (isNaN(number)) {
        return false;
    }
    return number >= lowerThreshold && number <= upperThreshold;
}