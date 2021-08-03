import * as Hash from 'murmurhash3js'
import { v4 as uuidv4 } from 'uuid';

if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./xpmint');
}  

type GroupConfiguration = {
    [name: string]: number
}

class Experiment {
    groups: GroupConfiguration
    keepsGroupOnResize?: boolean = false
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
        this.cache = new Map()
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
            console.log(this.config)
            console.log(hash, n, total, ranges)
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

        // persist to local storage if necessary
        if (this.experimentKeepsAssignmentOnResize(experiment)) {
            this.storeExperimentGroup(experiment, group)
        }
        return group
    }

    fetchExperimentGroup(experiment: string): string | void {

        let group

        // get from cache

        group = this.cache.get(experiment)

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

    setUserId(userId: string) {
        this.userId = userId
    }
}
