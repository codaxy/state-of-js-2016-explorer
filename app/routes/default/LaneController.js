import {Controller} from 'cx/ui/Controller';
import backCalc from '../../data/Worker';

export default class extends Controller {
    init() {
        super.init();

        this.addTrigger('lane', ['$lane.id'], id => {
            if (id != null) {
                this.countAnswers(id);
                this.calculatePercentages(id);
                this.getSatisfaction(id);
                this.getRelatedProjects(id);
                this.getFeatureImportanceScores(id);
                this.getJSScores(id);
            }
        }, true);
    }

    countAnswers(id) {
        this.store.set('$lane.answers.status', 'loading');
        backCalc({type: 'countProjectEntriesByAnswer', projectId: id})
            .then(data=> {
                this.store.set('$lane.answers.data', data);
                this.store.set('$lane.answers.status', 'ok');
            })
            .catch(e=>{
                this.store.set('$lane.answers.status', 'error');
            });
    }

    calculatePercentages(id) {
        backCalc({type: 'calculateAnswerPercentages', projectId: id})
            .then(data => {
                this.store.set('$lane.percentages.data', data);
            })
    }

    getSatisfaction(id) {
        backCalc({type: 'getCategorySatisfactionForProject', projectId: id})
            .then(data => {
                this.store.set('$lane.satisfaction.data', data);
            })
    }

    getRelatedProjects(id) {
        backCalc({type: 'getRelatedProjects', projectId: id})
            .then(data => {
                this.store.set('$lane.related.data', data);
            })
    }

    getFeatureImportanceScores(id) {
        backCalc({type: 'getFeatureImportanceScores', projectId: id})
            .then(data => {
                this.store.set('$lane.features.data', data);
            })
    }

    getJSScores(id) {
        backCalc({type: 'getJSScores', projectId: id})
            .then(data => {
                this.store.set('$lane.js.data', data);
            })
    }
}