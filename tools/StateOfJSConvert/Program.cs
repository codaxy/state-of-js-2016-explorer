using Codaxy.Xlio;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StateOfJSConvert
{
    class Answer
    {
        public string text { get; set; }
        public bool? interested { get; set; }
        public bool used { get; set; }
    }

    class Topic
    {
        public string name { get; set; }
        public string type { get; set; }
        public string category { get; set; }
    }

    class Program
    {
        static void Main(string[] args)
        {
            var wb = Workbook.Load("Data.xlsx");

            var sheet = wb.Sheets[0];

            var columnNames = new SortedDictionary<int, string>();

            var result = new JObject();
            var records = new JArray();

            var answers = new List<Answer>
            {
                new Answer { text = "I've never heard of it", used = false },
                new Answer { text = "I've heard of it, and am not interested", interested = false, used = false },
                new Answer { text = "I've used it before, and would not use it again", interested = false, used = true },
                new Answer { text = "I've heard of it, and would like to learn it", interested = true, used = false },
                new Answer { text = "I've used it before, and would use it again", interested = true, used = true },
            };

            var answersMap = new Dictionary<string, int>();
            for (var i = 0; i < answers.Count; i++)
                answersMap.Add(answers[i].text, i);

            var features = new List<string>
            {
                "I don't know what that is", "Not needed", "Nice-to-have, but not important", "Major feature", "Vital feature"
            };

            var experience = new List<string>
            {
                "Less than one year", "1-2 years", "2-5 years", "5-10 years", "10-20 years", "20+ years"
            };

            var companySize = new List<string>
            {
                "Just me", "1-5 people", "5-10 people", "10-20 people", "20-50 people", "50-100 people", "100-1000 people", "1000+ people"
            };

            var salary = new List<string>
            {
                "I work for free :(", "$0-$10k", "$10-$30k", "$30-50k", "$50-$100k", "$100k-$200k", "$200k+"
            };

            var editor = new List<string>
            {
                "Sublime Text", "Atom", "Webstorm", "Vim", "Emacs"
            };

            var spacetabs = new List<string>
            {
                "Spaces rule!", "Tabs for life!"
            };

            var topics = new List<Topic>();
            var topicIndex = new Dictionary<int, int>();

            var catTriggers = new Dictionary<string, string>{
                { "Good Old Plain JavaScript", "js" },
                { "No Front-End Framework", "front-end" },
                { "Redux", "state" },
                { "Custom REST API", "api" },
                { "Meteor", "full-stack" },
                { "Mocha", "test" },
                { "Plain CSS", "css" },
                { "Webpack", "build" },
                { "Native Apps", "mobile" },
                { "Server-Side Rendering", "features" },
                { "JavaScript is moving in the right direction", "survey" },
                { "Years of Experience", "dev" }
            };

            string category = null;

            var skipColumns = new[] {
                "#",
                "Other",
                "Start Date (UTC)",
                "Submit Date (UTC)"
            };

            foreach (var cell in sheet[0])
            {
                var name = cell.Value.Value as string;
                if (name != null)
                {
                    string ncat;
                    if (catTriggers.TryGetValue(name, out ncat))
                        category = ncat;

                    if (skipColumns.Contains(name))
                        continue;

                    if (name.Contains("Other"))
                        continue;

                    topicIndex.Add(cell.Key, topics.Count);

                    topics.Add(new Topic
                    {
                        name = name,
                        category = category
                    });
                }
            }


            for (var i = 1; i < sheet.Data.Count; i++)
            {
                var record = new JArray();
                for (var t = 0; t < topics.Count; t++)
                    record.Add(null);

                foreach (var cell in sheet[i])
                {
                    int topicId;
                    if (topicIndex.TryGetValue(cell.Key, out topicId))
                    {
                        if (cell.Value.Value is string)
                        {
                            int index;
                            var text = cell.Value.Value.ToString();
                            if (answersMap.TryGetValue(text, out index))
                            {
                                record[topicId] = index;
                                topics[topicId].type = "project";
                            }
                            else if ((index = features.IndexOf(text)) != -1)
                            {
                                record[topicId] = index;
                                topics[topicId].type = "feature";
                            }
                            else if ((index = experience.IndexOf(text)) != -1)
                            {
                                record[topicId] = index;
                                topics[topicId].type = "experience";
                            }
                            else if ((index = companySize.IndexOf(text)) != -1)
                            {
                                record[topicId] = index;
                                topics[topicId].type = "company-size";
                            }
                            else if ((index = salary.IndexOf(text)) != -1)
                            {
                                record[topicId] = index;
                                topics[topicId].type = "salary";
                            }
                            else if ((index = editor.IndexOf(text)) != -1)
                            {
                                record[topicId] = index;
                                topics[topicId].type = "editor";
                            }
                            else if ((index = spacetabs.IndexOf(text)) != -1)
                            {
                                record[topicId] = index;
                                topics[topicId].type = "spacetabs";
                            }
                        }
                        else if (cell.Value.Value is double)
                        {
                            record[topicId] = (int)(double)cell.Value.Value;
                            topics[topicId].type = "question";
                        }
                    }
                }

                records.Add(record);
            }

            result["topics"] = JToken.FromObject(topics);
            result["answers"] = JToken.FromObject(answers);

            result["features"] = JToken.FromObject(features);
            result["experience"] = JToken.FromObject(experience);
            result["companySize"] = JToken.FromObject(companySize);
            result["salary"] = JToken.FromObject(salary);
            result["editor"] = JToken.FromObject(editor);
            result["spacetabs"] = JToken.FromObject(spacetabs);

            result["entries"] = records;

            File.WriteAllText(@"..\..\..\..\app\data\data.js", "export default " + result.ToString(Formatting.Indented), Encoding.UTF8);
        }
    }
}
