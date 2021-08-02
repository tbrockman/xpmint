import Hash from 'murmurhash3js'
import LRU from 'lru-cache'
import { v4 as uuidv4 } from 'uuid';

type GroupConfiguration = {
    [name: string]: number
}

type Experiment = {
    groups: GroupConfiguration
    keepsGroupOnResize: boolean
}

type ExperimentConfiguration = {
    [name: string]: Experiment
}

class XpmintConfiguration {
    experiments: ExperimentConfiguration
    cacheSize?: number = 128
}

export default class Xpmint {

    config: XpmintConfiguration
    experimentCache: LRU<string, string>
    userId: string

    constructor(config: XpmintConfiguration) {
        this.config = config
        this.experimentCache = new LRU(this.config.cacheSize)
        this.userId = this.getUserId()
    }

    getUserId(): string {
        const userStorageKey = 'xpmint:user_id'

        if (!this.userId) {
            this.userId = localStorage.getItem(userStorageKey)

            if (!this.userId) {
                this.userId = uuidv4()
                localStorage.setItem(userStorageKey, this.userId)
            }
        }
        return this.userId
    }

    getExperimentGroup(experiment: string): string | void {

        let group = this.fetchExperimentGroup(experiment)

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
            const hash = Hash.x86.hash32(this.userId + experiment)
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
        this.experimentCache.set(experiment, group)

        // persist to local storage if necessary
        if (this.experimentKeepsAssignmentOnResize(experiment)) {
            this.storeExperimentGroup(experiment, group)
        }
        return group
    }

    fetchExperimentGroup(experiment: string): string | void {

        let group

        // get from cache

        group = this.experimentCache.get(experiment)

        // get from localstorage if applicable

        if (!group && this.experimentKeepsAssignmentOnResize(experiment)) {
            group = this.getExperimentGroupFromLocalStorage(experiment)
        }
        return group
    }

    getExperimentGroupFromLocalStorage(experiment: string) {
        return localStorage.getItem('xpmint:' + this.userId + ':' + experiment)
    }

    storeExperimentGroup(experiment: string, group: string) {
        localStorage.setItem('xpmint:' + this.userId + ':' + experiment, group)
    }

    experimentKeepsAssignmentOnResize(experiment: string) {
        return experiment in this.config.experiments && 
            this.config.experiments[experiment].keepsGroupOnResize
    }

    setUser(userId: string) {
        this.userId = userId
    }
}
