import Hashids from 'hashids';
import CryptoJS from 'crypto-js';
const hid = new Hashids('Krish', 8);

// Function to convert a string to a numeric representation using SHA-256
const stringToNumber = async (str) => {
  const hash = CryptoJS.SHA256(str).toString(CryptoJS.enc.Hex);
  // Convert the hex string to a big integer
  const bigint = BigInt('0x' + hash);
  return bigint;
};

const genHasId = async (stringId) => {
    try {
      console.log('Original ID:', stringId);
  
      // Convert string ID to a numeric representation
      const numericId = stringToNumber(stringId);
  
      // Encode the numeric ID
      const encodedId = hid.encode(numericId);
      console.log('Encoded ID:', encodedId);
    } catch (error) {
      console.error('Error generating hash ID:', error);
    }
  };