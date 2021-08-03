// assuming you have built Xpmint
import Xpmint from '../package/dist/index.js'

const xpmint = new Xpmint({
    experiments: {
        test: {
            variants: {
                variant_2: 1,
                control: 2,
                variant: 4
            },
            keepsGroupOnResize: true
        }
    }
})

const group = xpmint.getExperimentGroup('test')
const element = document.getElementById('group')
element.innerText = group