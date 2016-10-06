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

    load(path, instructions) {
        this.store.set(path + '.status', 'loading');
        backCalc(instructions)
            .then(data=> {
                this.store.set(path + '.data', data);
                this.store.set(path + '.status', 'ok');
            })
            .catch(e=> {
                console.log(e);
                this.store.set(path + '.status', 'error');
            });
    }

    countAnswers(id) {
        this.load('$lane.answers', {
            type: 'countProjectEntriesByAnswer',
            projectId: id
        });
    }

    calculatePercentages(id) {
        this.load('$lane.percentages', {
            type: 'calculateAnswerPercentages',
            projectId: id
        });
    }

    getSatisfaction(id) {
        this.load('$lane.satisfaction', {
            type: 'getCategorySatisfactionForProject',
            projectId: id
        });
    }

    getRelatedProjects(id) {
        this.load('$lane.related', {
            type: 'getRelatedProjects',
            projectId: id
        });
    }

    getFeatureImportanceScores(id) {
        this.load('$lane.features', {
            type: 'getFeatureImportanceScores',
            projectId: id
        });
    }

    getJSScores(id) {
        this.load('$lane.js', {
            type: 'getJSScores',
            projectId: id
        });
    }
}