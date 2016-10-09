import {Controller} from 'cx/ui/Controller';
import data from '../../data/precomputed';

export default class extends Controller {
    init() {
        super.init();

        this.addTrigger('lane', ['$lane.id'], id => {
            if (id != null)
                this.store.set('$lane', data.find(x=>x.id == id));
        }, true);
    }

    // countAnswers(id) {
    //     this.load('$lane.answers', {
    //         type: 'countProjectEntriesByAnswer',
    //         projectId: id
    //     });
    // }
    //
    // load(path, instructions) {
    //     this.store.set(path + '.status', 'loading');
    //     backCalc(instructions)
    //         .then(data=> {
    //             this.store.set(path + '.data', data);
    //             this.store.set(path + '.status', 'ok');
    //         })
    //         .catch(e=> {
    //             console.log(e);
    //             this.store.set(path + '.status', 'error');
    //         });
    // }
    //
    // calculatePercentages(id) {
    //     this.load('$lane.percentages', {
    //         type: 'calculateAnswerPercentages',
    //         projectId: id
    //     });
    // }
    //
    // getSatisfaction(id) {
    //     this.load('$lane.satisfaction', {
    //         type: 'getCategorySatisfactionForProject',
    //         projectId: id
    //     });
    // }
    //
    // getRelatedProjects(id) {
    //     this.load('$lane.related', {
    //         type: 'getRelatedProjects',
    //         projectId: id
    //     });
    // }
    //
    // getFeatureImportanceScores(id) {
    //     this.load('$lane.features', {
    //         type: 'getFeatureImportanceScores',
    //         projectId: id
    //     });
    // }
    //
    // getJSScores(id) {
    //     this.load('$lane.js', {
    //         type: 'getJSScores',
    //         projectId: id
    //     });
    // }
    //
    // getDevDetails(id) {
    //     this.load('$lane.dev', {
    //         type: 'getDevDetails',
    //         projectId: id
    //     });
    // }
    //
    // getDevTabPreference(id) {
    //     this.load('$lane.spacetabs', {
    //         type: 'getDevTabPreference',
    //         projectId: id
    //     });
    // }
}