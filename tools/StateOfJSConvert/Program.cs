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
                new Answer { text = "I've heard of it, and am not interested", interested =false, used = false },
                new Answer { text = "I've used it before, and would not use it again", interested =true, used = true },
                new Answer { text = "I've heard of it, and would like to learn it", interested =true, used = false },
                new Answer { text = "I've used it before, and would use it again", interested =false, used = true },
            };

            var answersMap = new Dictionary<string, int>();
            for (var i = 0; i < answers.Count; i++)
                answersMap.Add(answers[i].text, i);

            var features = new List<String>() {
                "I don't know what that is", "Not needed", "Nice-to-have, but not important", "Major feature", "Vital feature"
            };


            var categories = new List<Topic>();
            var catIndex = new Dictionary<int, int>();

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

            foreach (var cell in sheet[0])
            {
                var name = cell.Value.Value as string;
                if (name != null)
                {
                    string ncat;
                    if (catTriggers.TryGetValue(name, out ncat))
                        category = ncat;

                    if (name == "#")
                        continue;

                    if (name.Contains("Other"))
                        continue;

                    catIndex.Add(cell.Key, categories.Count);

                    categories.Add(new Topic
                    {
                        name = name,
                        category = category
                    });
                }
            }


            for (var i = 1; i < sheet.Data.Count; i++)
            {
                var record = new JArray();

                foreach (var cell in sheet[i])
                {
                    int ci;
                    if (catIndex.TryGetValue(cell.Key, out ci))
                    {
                        if (cell.Value.Value is string)
                        {
                            int index;
                            var text = cell.Value.Value.ToString();
                            if (answersMap.TryGetValue(text, out index))
                            {
                                record.Add(index);
                                categories[ci].type = "project";
                            }
                            else if ((index = features.IndexOf(text)) != -1)
                            {
                                record.Add(index);
                                categories[ci].type = "feature";
                            }
                        }
                        else if (cell.Value.Value is double)
                        {
                            record.Add((int)(double)cell.Value.Value);
                            categories[ci].type = "question";
                        }
                        else
                            record.Add(null);
                    }
                }

                records.Add(record);
            }

            result["topics"] = JToken.FromObject(categories);
            result["answers"] = JToken.FromObject(answers);
            result["features"] = JToken.FromObject(features);
            result["entries"] = records;

            File.WriteAllText(@"..\..\..\..\app\data\data.js", "export default " + result.ToString(Formatting.Indented), Encoding.UTF8);
        }
    }
}
