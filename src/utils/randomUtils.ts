// dec2hex :: Integer -> String
// i.e. 0-255 -> '00'-'ff'
export function dec2hex(dec: number) {
  return dec.toString(16).padStart(2, '0');
}

// generateId :: Integer -> String
export function generateId(N = 20) {
    const s = "0123456789";
    // const s = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return Array(N).join().split(',').map(function() { return s.charAt(Math.floor(Math.random() * s.length)); }).join('')
}

// console.log(generateId());
// "82defcf324571e70b0521d79cce2bf3fffccd69"

// console.log(generateId(20));
// "c1a050a4cd1556948d41"
