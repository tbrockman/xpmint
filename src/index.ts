import murmurhash from './murmurhash'

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
    cache: Map<string, Map<string, string>>
    userId: string

    constructor(config: XpmintConfiguration) {
        this.config = config
        // TODO: this cache probably shouldn't be unbounded
        this.cache = new Map()
    }

    getUserId(): string {
        return this.userId
    }

    storeExperimentGroupInCache(experiment: string, group: string) {
        const userId = this.getUserId()

        if (this.cache.has(userId)) {
            const cached = this.cache.get(userId)
            cached.set(experiment, group)
        }
        else {
            this.cache.set(userId, new Map([[experiment, group]]))
        }
    }

    fetchExperimentGroupFromCache(experiment: string): string | void {
        const userId = this.getUserId()

        if (this.cache.has(userId)) {
            return this.cache.get(userId).get(experiment)
        }
    }

    getExperimentGroup(experiment: string): string {

        let group = this.fetchExperimentGroupFromCache(experiment)

        if (!group) {
            group = this.assignExperimentGroup(experiment)
        }
        return group
    }

    assignExperimentGroup(experiment: string, group?: string): string {

        if (!this.getUserId()) {
            throw new Error('User ID is unset. Call `this.setUserId(string)` before experiment assignment.')
        }

        if (!group) {

            if (!(experiment in this.config.experiments)) {
                throw new Error('Experiment "' + experiment + '" is not defined.')
            }

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

            const hash = murmurhash(this.getUserId() + experiment)
            const n = hash % total
            group = ranges.find(([, start, end]) => {
                return n >= start && n < end
            })[0]
        }
        else {
            if (!(group in this.config.experiments[experiment].groups)) {
                throw new Error('Group "' + group + '" is not a defined experiment group.')
            }
        }
        // add result to cache
        this.storeExperimentGroupInCache(experiment, group)

        return group
    }

    setUserId(userId: string) {
        this.userId = userId
    }
}
