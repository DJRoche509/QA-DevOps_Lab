const shuffle = require("../src/shuffle");

// describe block for shuffle
describe("shuffle tests", () => {
  
    test('shuffle should return an array', () => {
      const array =[1,3,5];
      const returnValue = shuffle(array)
      expect(returnValue).toBeInstanceOf(Array);  
      //expect(Array.isArray(returnValue)).toBe(true);     //Alternatively
    })

    test('should return an array of same length as argument passed in', () => {
      const array =[1,3,5,9,4];
      const returnLenValue = shuffle(array).length
      expect(returnLenValue).toEqual(shuffle(array).length);
    })

    test('should have all the same items in the array', () => {
      const array = [1,3,5,9,7];
      const result = shuffle(array)
      expect(result).toEqual(expect.arrayContaining(array));
      expect(result).not.toEqual(array)
    })

    test('should check items have been shuffled', () => {
      const arrToshuffle = [1,3,5,7,9];
      const result = shuffle(arrToshuffle)
      expect(result).not.toEqual(arrToshuffle)
    })
});
