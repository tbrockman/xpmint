import LRU from 'lru-cache';
declare type VariantConfiguration = {
    [name: string]: number;
};
declare type Experiment = {
    variants: VariantConfiguration;
    keepsGroupOnResize: boolean;
};
declare type ExperimentConfiguration = {
    [name: string]: Experiment;
};
declare class XpmintConfiguration {
    experiments: ExperimentConfiguration;
    cacheSize?: number;
}
declare class Xpmint {
    config: XpmintConfiguration;
    experimentCache: LRU<string, string>;
    userId: string;
    constructor(config: XpmintConfiguration);
    getUserId(): string;
    getExperimentGroup(experiment: string): string | void;
    assignExperimentGroup(experiment: string): string;
    fetchExperimentGroup(experiment: string): string | void;
    getExperimentGroupFromLocalStorage(experiment: string): string;
    storeExperimentGroup(experiment: string, variant: string): void;
    experimentKeepsAssignmentOnResize(experiment: string): boolean;
    setUser(userId: string): void;
}
declare const _default: {
    Xpmint: typeof Xpmint;
};
export default _default;
