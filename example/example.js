// assuming you have built Xpmint
import Xpmint from '../dist/index.js'

const xpmint = new Xpmint({
    experiments: {
        test: {
            groups: {
                variant_2: 1,
                control: 2,
                variant: 4
            }
        }
    }
})

xpmint.setUserId('abcd')
const group = xpmint.getExperimentGroup('test')
const element = document.getElementById('group')
element.innerText = group