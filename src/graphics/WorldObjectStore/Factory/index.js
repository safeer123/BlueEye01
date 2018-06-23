import configure from "./configure";

// WOFactory: Defines a factory for creating instances of World Objects
class WOFactory {
  constructor() {
    this.countOfObjects = 0;
    this.WOClassLookup = {};
  }

  // register a type of WO
  registerType(type, Class) {
    if (this.WOClassLookup[type]) {
      console.error(
        `registerType: ${type} is already defined. This will override previous definition.`
      );
    }
    this.WOClassLookup[type] = Class;
  }

  // create instance of WO of the specified type
  // List of argument objects to be passed in
  create(type, argObjects) {
    if (this.WOClassLookup[type]) {
      const id = this.generateUniqueId(type);
      const Class = this.WOClassLookup[type];
      const obj = new Class(...argObjects);
      obj.setId(id);
      obj.setType(type);
      return obj;
    }
    return null;
  }

  // Generate a unique id using object count
  generateUniqueId(type) {
    this.countOfObjects += 1;
    return `${this.countOfObjects}_${type}`;
  }
}

const WOFACTORY = new WOFactory();
configure(WOFACTORY);

export default WOFACTORY;
