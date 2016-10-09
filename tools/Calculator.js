var data = require('./tmp');
var _  = require('lodash');
var fs = require('fs');

const {answers, topics, categories, entries, features, experience, companySize, salary, editor, spacetabs} = data;

for (let i = 0; i < topics.length; i++)
    topics[i].id = i;


function countProjectEntriesByAnswer(projectId) {
    var counts = _.countBy(entries, e=>e[projectId]);
    return answers.map((a, i) => ({
        text: a.text,
        count: counts[i]
    }));
}

function calculateAnswerPercentages(projectId) {
    var interested = _.countBy(entries, e=>(e[projectId] != null && answers[e[projectId]].interested) ? "yes" : "no");
    var used = _.countBy(entries, e=>(e[projectId] != null && answers[e[projectId]].used) ? "yes" : "no");
    return {
        interested: (interested.yes || 0) / entries.length,
        used: (used.yes || 0) / entries.length
    }
}

function getCategorySatisfactionForProject(projectId) {
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


function getRelatedProjects(projectId, top = 10)
{
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

function getScoreSheet({projectId, answers}) {
    let records = [];
    topics.forEach((t, i)=> {
        if (answers[t.type])
            records.push({
                id: i,
                text: t.name,
                scores: answers[t.type].map((a, i) => ({
                    id: i + 1,
                    count: 0,
                    text: a
                }))
            });
    });

    _.forEach(_.filter(entries, e=>e[projectId] == 4), e=> {
        for (let p = 0; p < records.length; p++)
            if (e[records[p].id] != null)
                records[p].scores[e[records[p].id]].count++;
    });

    return records;
}

function getFeatureImportanceScores(projectId) {
    return getScoreSheet({
        projectId: projectId,
        answers: {
            'feature': features
        }
    });
}

function getJSScores(projectId) {
    let records = [];
    topics.forEach((t, i)=> {
        if (t.type == 'question' && t.category == "survey")
            records.push({
                id: i,
                text: t.name,
                points: 0,
                count: 0,
                scores: [
                    {score: 1, count: 0},
                    {score: 2, count: 0},
                    {score: 3, count: 0},
                    {score: 4, count: 0},
                    {score: 5, count: 0}
                ]
            });
    });

    _.forEach(_.filter(entries, e=>e[projectId] == 4), e=> {
        for (let p = 0; p < records.length; p++)
            if (e[records[p].id] > 0) {
                records[p].scores[e[records[p].id] - 1].count++;
                records[p].count++;
                records[p].points += e[records[p].id];
                records[p].avgScore = records[p].points / records[p].count;
            }
    });

    return records;
}

function getDevDetails(projectId) {
    return getScoreSheet({
        projectId: projectId,
        answers: {
            'experience': experience,
            'company-size': companySize,
            'salary': salary,
            'editor': editor
        }
    });
}

function getDevTabPreference(projectId) {
    var scoreSheet = getScoreSheet({
        projectId: projectId,
        answers: {
            'spacetabs': spacetabs
        }
    });

    var result = scoreSheet[0];
    var scores = result.scores;

    var total = _.sumBy(scores, 'count');
    _.forEach(scores, (s) => {
        s.share = s.count / total;
    });

    return {
        question: result.text,
        scores: scores
    };
}

var results = [];
for (var id = 0; id < topics.length; id++) {
    let t = topics[id];
    if (t.type == 'project')
        results.push({
            id: id,
            name: t.name,
            answers: countProjectEntriesByAnswer(id),
            percentages: calculateAnswerPercentages(id),
            satisfaction: getCategorySatisfactionForProject(id),
            related: getRelatedProjects(id),
            features: getFeatureImportanceScores(id),
            js: getJSScores(id),
            dev: getDevDetails(id),
            spacetabs: getDevTabPreference(id)
        })
}

fs.writeFile('app/data/precomputed.js', 'export default '  + JSON.stringify(results, null, '\t'));



