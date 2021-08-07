import Xpmint from '../src/index'

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

    xpmint.setUserId('a')
    const group = xpmint.getExperimentGroup('test')
    const group2 = xpmint.getExperimentGroup('test')
    expect(group).toEqual(group2)
})

test('returns an approximately 1-n ratio, n E [1,99]', () => {

  let xpmint
  let counts:any
  
  for (let n = 1; n < 100; n++) {
    xpmint = new Xpmint({
      experiments: {
        test: {
            groups: {
                a: 1,
                b: n
            }
        }
      }
    })

    counts = {
      a: 0,
      b: 0
    }

    for (let i = 0; i < 1000; i++) {
      xpmint.setUserId(i.toString())
      const group = xpmint.getExperimentGroup('test')
      counts[group] += 1
    }
    expect(Math.abs((1/n) - (counts.a / counts.b))).toBeLessThan(0.1)
  }
})

test('throws if experiment not defined', () => {
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

  xpmint.setUserId('a')
  expect(() => {
    const group = xpmint.getExperimentGroup('doesnt-exist')
  }).toThrow()
})

test('throws if group not defined in configuration', () => {
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

  xpmint.setUserId('a')
  expect(() => {
    xpmint.assignExperimentGroup('test', 'c')
  }).toThrow()
})