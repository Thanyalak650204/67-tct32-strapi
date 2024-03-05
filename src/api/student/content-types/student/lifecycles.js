const crypto = require('crypto');
const md5 = require('md5');

const algorithm = 'aes-256-cbc';
console.log('process.env.SECRET_KEY', process.env.SECRET_KEY);
const key = Buffer.from(process.env.SECRET_KEY); // Should be a 32-byte key for aes-256
const iv = process.env.SECRET_KEY_IV; // Should be a 16-byte IV for aes-256-cbc


const encryptmobile = (mobile) => {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encryptedmobile = cipher.update(mobile, 'utf8', 'hex');
  encryptedmobile += cipher.final('hex');
 // Pad the encrypted phone number to ensure it's at least 128 characters long
  return encryptedmobile;
};

const decryptmobile = (encryptedmobile) => {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let mobile = decipher.update(encryptedmobile, 'hex', 'utf8');
  mobile += decipher.final('utf8');

  return mobile;
};

module.exports = {
  async beforeCreate(event) {
    console.log('beforeCreate', event.params);
    event.params.data.mobile = encryptmobile(event.params.data.mobile);
  },
  async beforeUpdate(event) {
    console.log('beforeUpdate', event.params.data);
    event.params.data.mobile = encryptmobile(event.params.data.mobile);
  },
  async afterFindMany(event) {
    console.log('afterFindMany', event.result);
    event.result.forEach(item => {
      if (item.mobile) {
        item.mobile = decryptmobile(item.mobile);
        console.log('afterFindMany :', item.mobile);
      }
    });
  },
  async afterFindOne(event) {
    console.log('afterFindOne', event.result);
    if (event.result && event.result.mobile) {
      event.result.mobile = decryptmobile(event.result.mobile);
      console.log('afterFindOne :', event.result.mobile);
    }
  },
};
