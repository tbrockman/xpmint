import murmurhash from './murmurhash.js'

type GroupConfiguration = {
    [name: string]: number
}

class Experiment {
    groups: GroupConfiguration
}

type ExperimentConfiguration = {
    [name: string]: Experiment
}

class XpmintConfiguration {
    experiments: ExperimentConfiguration
}

export default class Xpmint {

    config: XpmintConfiguration
    cache: Map<string, string>
    userId: string

    constructor(config: XpmintConfiguration) {
        this.config = config
        // TODO: this cache probably shouldn't be unbounded
        this.cache = new Map()
    }

    getUserId(): string {
        return this.userId
    }

    getExperimentGroup(experiment: string): string | void {

        let group = this.cache.get(experiment)

        if (!group) {
            group = this.assignExperimentGroup(experiment)
        }
        return group
    }

    assignExperimentGroup(experiment: string, group?: string): string {

        if (!group) {
            const groups = this.config.experiments[experiment].groups
            const iterable = []
            const ranges: [string, number, number][] = []
            let total = 0
            for (let key in groups) {
                iterable.push([key, groups[key]])
            }
            iterable.sort((a, b) => (a[0] as string).localeCompare((b[0] as string)))
            iterable.forEach(([name, range]: [string, number]) => {
                ranges.push([name, total, total+range])
                total += range
            })
            
            if (!this.getUserId()) {
                console.warn('User ID is unset, assigned experiment group will not be consistent. Call `setUserId(string)` to fix.')
            }

            const hash = murmurhash(this.getUserId() + experiment)
            const n = hash % total
            group = ranges.find(([, start, end]) => {
                return n >= start && n < end
            })[0]
        }
        else {
            if (!(group in this.config.experiments[experiment].groups)) {
                throw new Error('Group: ' + group + ' is not a defined experiment group.')
            }
        }
        // add result to cache
        this.cache.set(experiment, group)

        return group
    }

    setUserId(userId: string) {
        this.userId = userId
    }
}
