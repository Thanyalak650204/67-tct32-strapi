const md5 = require("md5");

module.exports = {
  async beforeCreate(entry) {
    console.log(entry);
    console.log("beforeCreate is being executed...");

    if (entry.params.data.mobile) {
      const hashedMobile = md5(entry.params.data.mobile);
      entry.params.data.mobileHash = hashedMobile;
      entry.params.data.mobile = entry.params.data.mobile;
    }
  },
};