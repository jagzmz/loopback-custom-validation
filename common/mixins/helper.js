function testAndReplacePlaceholder(msg, pholder, defReg) {
  pholder = "'" + pholder + "'";
  console.log(pholder);
  defReg = defReg || "%s";
  defReg = new RegExp(defReg);
  if (defReg.test(msg)) {
    msg = msg.replace(defReg, pholder);

    return msg;
  } else {
    return msg + " " + pholder;
  }
}

module.exports = {
  formatErr: testAndReplacePlaceholder
};
