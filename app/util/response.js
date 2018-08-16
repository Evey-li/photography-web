/**
 * {
 *     code: Number
 *     result: Object,
 *     error: String,
 * }
 */
class Response {
  static get SUCCESS() {
    return 0;
  }
  static get USER_EXIST() {
    return 0x10;
  }
  static get PARAM_ERROR() {
    return 0x11;
  }
  static get PASSWORD_NOT_MATCH() {
    return 0x12;
  }
  static get USER_NOT_LOGIN() {
    return 0x13;
  }
  static get USER_NOT_EXIST() {
    return 0x14;
  }
  static get SERVER_ERROR() {
    return 0x15;
  }
  static get SAME_PARAMS() {
    return 0x16;
  }
  static get SAME_USERNAME() {
    return 0x17;
  }
  static get NULL_RESULT() {
    return 0x18;
  }
  constructor(code, result, error) {
    this.code = code;
    this.result = result;
    this.error = error;
  }
}

module.exports = Response;