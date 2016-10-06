import data from './data';
import _ from 'lodash';

const { answers, topics, categories, entries, features } = data;

for (let i = 0; i<topics.length; i++)
    topics[i].id = i;

// verification
// var testTopic = topics.find(a=>a.name == 'Backbone');
// console.log(entries.map(a=>answers[a[testTopic.id]]));

class Services {

    static getTopics({filter}) {
        return _.filter(topics, filter);
    }

    static countProjectEntriesByAnswer({projectId}) {
        var counts = _.countBy(entries, e=>e[projectId]);
        return answers.map((a, i) => ({
            text: a.text,
            count: counts[i]
        }));
    }

    static calculateAnswerPercentages({projectId}) {
        var interested = _.countBy(entries, e=>(e[projectId]!=null && answers[e[projectId]].interested) ? "yes" : "no");
        var used = _.countBy(entries, e=>(e[projectId]!=null && answers[e[projectId]].used) ? "yes" : "no");
        return {
            interested: (interested.yes || 0) / entries.length,
            used: (used.yes || 0) / entries.length
        }
    }

    static getCategorySatisfactionForProject({projectId}) {
        var project = topics[projectId];
        var satisfactionId = _.findIndex(topics, {
            category: project.category,
            type: 'question'
        });

        var counts = _.countBy(_.filter(entries, e=>e[projectId] == 4 && e[satisfactionId]), e=>e[satisfactionId]);
        var records = [{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}];

        //normalize data so it's easier to compare

        var sum = 0, count = 0;
        for (let x in counts) {
            count += counts[x];
        }

        for (let x in counts) {
            let score = Number(x);
            records[score - 1].share = counts[x] / count;
            sum += score * counts[x];
        }

        return {
            question: topics[satisfactionId].name,
            counts: records,
            average: sum / count
        }
    }


    static getRelatedProjects({projectId, top = 10}) {
        var project = topics[projectId];

        var records = [];

        topics.forEach(p=> {
            if (p.type == 'project' && p.id != project.id) {
                records.push({
                    score: 0,
                    id: p.id,
                    name: p.name
                });
            }
        });

        _.forEach(_.filter(entries, e=>e[projectId] == 4), e=> {
            for (let p = 0; p < records.length; p++)
                if (e[records[p].id] == 4)
                    records[p].score++;
        });

        records = _.orderBy(records, 'score', 'desc');
        return records.slice(0, top);
    }

    static getFeatureImportanceScores({projectId}) {
        let records = [];
        topics.forEach((t, i)=> {
            if (t.type == 'feature')
                records.push({
                    id: i,
                    text: t.name,
                    scores: [
                        {id: 1, count: 0, text: features[0]},
                        {id: 2, count: 0, text: features[1]},
                        {id: 3, count: 0, text: features[2]},
                        {id: 4, count: 0, text: features[3]},
                        {id: 5, count: 0, text: features[4]}
                    ]
                });
        });

        _.forEach(_.filter(entries, e=>e[projectId] == 4), e=> {
            for (let p = 0; p < records.length; p++)
                if (e[records[p].id] != null)
                    records[p].scores[e[records[p].id]].count++;
        });

        return records;
    }

    static getJSScores({projectId}) {
        let records = [];
        topics.forEach((t, i)=> {
            if (t.type == 'question' && t.category == "survey")
                records.push({
                    id: i,
                    text: t.name,
                    points: 0,
                    count: 0,
                    scores: [
                        {score: 1, count: 0 },
                        {score: 2, count: 0 },
                        {score: 3, count: 0 },
                        {score: 4, count: 0 },
                        {score: 5, count: 0}
                    ]
                });
        });

        _.forEach(_.filter(entries, e=>e[projectId] == 4), e=> {
            for (let p = 0; p < records.length; p++)
                if (e[records[p].id] > 0) {
                    records[p].scores[e[records[p].id]-1].count++;
                    records[p].count++;
                    records[p].points += e[records[p].id];
                    records[p].avgScore = records[p].points / records[p].count; 
                }
        });

        return records;
    }

    static processMessage(msg) {
        return Services[msg.type](msg);
    }
}

import registerPromiseWorker from 'promise-worker/register';

registerPromiseWorker(Services.processMessage);