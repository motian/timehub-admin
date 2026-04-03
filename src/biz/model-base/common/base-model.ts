interface BaseObj {
  [key: string | number]: any;
}

export default abstract class BaseModel implements BaseObj {
  toObject() {
    return JSON.parse(this.toString());
  }

  toString() {
    return JSON.stringify(this);
  }
}
