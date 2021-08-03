import Xpmint from '../src/index'

jest.mock('murmurhash3js', () => {
    return { 
        default: {
            x86: {
                hash32: () => { return 1 }
            }
        }
    }
})

class LocalStorageMock {

    length: number
    key: any
    store: any

    constructor() {
      this.store = {};
    }
  
    clear() {
      this.store = {};
    }
  
    getItem(key: string) {
      return this.store[key] || null;
    }
  
    setItem(key:string, value:any) {
      this.store[key] = String(value);
    }
  
    removeItem(key:string) {
      delete this.store[key];
    }
};
  
global.localStorage = new LocalStorageMock;

test('returns same experiment group on subsequent calls', () => {
    const xpmint = new Xpmint({
        experiments: {
            test: {
                groups: {
                    a: 1,
                    b: 1
                }
            }
        }
    })

    const group = xpmint.getExperimentGroup('test')
    const group2 = xpmint.getExperimentGroup('test')
    expect(group).toEqual(group2)
})