// Please check here for an explanation of this module
// https://github.com/Redisrupt/red/wiki/Local-CSS-with-CSS-Modules

const isObject = (obj) => obj !== null && typeof obj === 'object';

export default function sheet(locals) {
  if (!isObject(locals)) {
    throw new Error('no locals found');
  }

  const ins = {
    globalClassFor(...providedClasses) {
      let classNames = providedClasses;
      if (classNames.length === 0) {
        throw new Error('please provide some classNames');
      }

      classNames = classNames.reduce((seq, cName) => {
        if (isObject(cName)) {
          seq = seq.concat(Object.keys(cName).filter((key) => !!cName[key])); // eslint-disable-line
        } else {
          seq.push(cName);
        }
        return seq;
      }, []);

      classNames = classNames.join(' ').trim().split(/\s+/);

      return {
        '__className__': classNames.join(' '),
      };
    },
    classFor(...providedClasses) {
      let classNames = providedClasses;
      if (classNames.length === 0) {
        throw new Error('please provide some classNames');
      }

      classNames = classNames.map((cName) => {
        if (isObject(cName)) {
          if (cName.__className__) { // asumming it is an object we created with the globalClassFor
            return cName;
          }
          const evaluatedClasses = [];
          Object.keys(cName).forEach((key) => {
            if (cName[key]) {
              evaluatedClasses.push(key);
            }
          });
          return evaluatedClasses;
        }
        return cName;
      });

      return classNames.reduce((seq, klass) => {
        if (isObject(klass) && klass.__className__) {
          seq.push(klass.__className__);
          return seq;
        }

        let _klass = Array.isArray(klass) ? klass : [klass];

        _klass = _klass.join(' ').trim().split(/\s+/).filter((entry) => !!entry);

        _klass.forEach((localKlass) => {
          const className = locals[localKlass];
          if (!className) {
            throw new Error(`no local className found for "${localKlass}"`);
          }

          seq = seq.concat(className); // eslint-disable-line

        });

        return seq;
      }, []).join(' ');
    },
  };

  // aliases for shortener names
  ins.cf = ins.classFor;
  ins.g = ins.globalClassFor;

  return ins;
}
