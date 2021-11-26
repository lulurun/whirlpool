const knownClasses = {};

const Factory = {
  add: (name, cls) => {
    knownClasses[name] = cls;
  },
  createInstance: (name, el, app, parent) => {
    if (name in knownClasses) {
      return new knownClasses[name](name, el, app, parent);
    } else {
      return null;
    }
  }
};

export default Factory;
