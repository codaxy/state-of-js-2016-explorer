import {HtmlElement} from 'cx/ui/HtmlElement';
import {Repeater} from 'cx/ui/Repeater';
import {TextField} from 'cx/ui/form/TextField';
import {LookupField} from 'cx/ui/form/LookupField';
import {Checkbox} from 'cx/ui/form/Checkbox';
import {Button} from 'cx/ui/Button';
import Controller from './Controller';
import LaneController from './LaneController';
import {Svg} from 'cx/ui/svg/Svg';
import {Text as SvgText} from 'cx/ui/svg/Text';
import {Text} from 'cx/ui/Text';
import {PieChart, PieSlice} from 'cx/ui/svg/charts/PieChart';
import {Legend} from 'cx/ui/svg/charts/Legend';
import {Chart} from 'cx/ui/svg/charts/Chart';
import {Gridlines} from 'cx/ui/svg/charts/Gridlines';
import {Column} from 'cx/ui/svg/charts/Column';
import {Bar} from 'cx/ui/svg/charts/Bar';
import {NumericAxis} from 'cx/ui/svg/charts/axis/NumericAxis';
import {CategoryAxis} from 'cx/ui/svg/charts/axis/CategoryAxis';
import {CxCredit} from 'cx/ui/CxCredit';

export default <cx>
    <div class="b-report" controller={Controller}>
        <Repeater records:bind="$page.lanes" recordName="$lane">
            <div class="e-report-lane" controller={LaneController}>
                <div>
                    <LookupField
                        mod="project"
                        placeholder="Pick a project"
                        options:bind="$page.projects"
                        value:bind="$lane.id"
                        text:bind="$lane.name"
                        optionTextField="name"
                        required />
                </div>
                <div>
                    <Svg style="width:100%; height:200px;">
                        <Chart
                            offset="20 -20 -40 10"
                            axes={{
                                x: { type: NumericAxis, snapToTicks: 0 },
                                y: { type: CategoryAxis, vertical: true, hidden: true }
                            }}
                        >
                            <Repeater records:bind="$lane.answers.data">
                                <Bar
                                    colorIndex:expr="14 - {$index}"
                                    x:bind="$record.count"
                                    y:bind="$record.text"
                                >
                                    <SvgText bind="$record.text" anchors="0.5 0 0.5 0" dy="0.4em" dx="0.5em" />
                                </Bar>
                            </Repeater>
                        </Chart>
                    </Svg>
                </div>
                <div class="e-report-percentages">
                    <div>
                        <Svg style="width:100px;height:100px;">
                            <PieChart>
                                <PieSlice value:bind="$lane.percentages.data.used" r={90} r0={70} colorIndex={7} />
                                <PieSlice value:expr="1-{$lane.percentages.data.used}" r={90} r0={70} />
                            </PieChart>
                            <SvgText
                                tpl="{$lane.percentages.data.used:p;0}"
                                dy="0.4em"
                                ta="middle" />
                        </Svg>
                        <div>
                            of users already used <span text:bind="$lane.name" />.
                        </div>
                    </div>
                    <div>
                        <Svg style="width:100px;height:100px;">
                            <PieChart>
                                <PieSlice value:bind="$lane.percentages.data.interested" r={90} r0={70} colorIndex={9} />
                                <PieSlice value:expr="1-{$lane.percentages.data.interested}" r={90} r0={70}  />
                            </PieChart>
                            <SvgText
                                tpl="{$lane.percentages.data.interested:p;0}"
                                dy="0.4em"
                                ta="middle" />
                        </Svg>
                        <div>
                            of users would use <span text:bind="$lane.name" /> again or would like learn it.
                        </div>
                    </div>
                </div>
                <h3 text:tpl="Group of people who used {$lane.name} before and would like to use it again also said..." />

                <p text:bind="$lane.satisfaction.data.question" />

                <div>
                    <Legend.Scope>
                        <Svg style="width:100%; height:20px;">
                            <Chart
                                axes={{
                                    x: { type: NumericAxis, snapToTicks: 0, hidden: true },
                                    y: { type: CategoryAxis, vertical: true, hidden: true }
                                }}
                            >
                                <Repeater records:bind="$lane.satisfaction.data.counts">
                                    <Bar
                                        colorIndex:expr="14 - {$index}"
                                        x:bind="$record.share"
                                        name:bind="$record.id"
                                        style="stroke-width: 0"
                                        y="sat"
                                        stacked
                                    >
                                    </Bar>
                                </Repeater>
                                <SvgText tpl="avg: {$lane.satisfaction.data.average:n;2}" dy="0.35em" dx="-0.5em" anchors="0.5 1 0.5 1" textAnchor="end" />
                            </Chart>
                        </Svg>
                        <Legend />
                    </Legend.Scope>
                </div>

                <p text:tpl="Top 10 things other than {$lane.name} that were also used before and want to use again:" />

                <div>
                    <Svg style="width:100%; height:300px;">
                        <Chart
                            offset="20 -20 -40 10"
                            axes={{
                                x: { type: NumericAxis, snapToTicks: 0 },
                                y: { type: CategoryAxis, vertical: true, hidden: true, inverted: true }
                            }}
                        >
                            <Repeater records:bind="$lane.related.data">
                                <Bar
                                    colorIndex={12}
                                    x:bind="$record.score"
                                    y:bind="$record.name"
                                >
                                    <SvgText bind="$record.name" anchors="0.5 0 0.5 0" dy="0.4em" dx="0.5em" />
                                </Bar>
                            </Repeater>
                        </Chart>
                    </Svg>
                </div>

                <p>Importance of features and tools.</p>

                <Legend.Scope>
                    <div class="e-report-features">
                        <Repeater records:bind="$lane.features.data">
                            <div class="e-report-feature">
                                <Svg style="width:100%; height:100px;">
                                    <Chart
                                        axes={{
                                            y: { type: NumericAxis, snapToTicks: 0, vertical: true, hidden: true },
                                            x: { type: CategoryAxis, hidden: true }
                                        }}
                                    >
                                        <Repeater records:bind="$record.scores">
                                            <Column
                                                colorIndex:expr="14 - {$index}"
                                                name:bind="$record.text"
                                                y:bind="$record.count"
                                                x:bind="$record.text"
                                            />
                                        </Repeater>
                                    </Chart>
                                </Svg>
                                <Text bind="$record.text" />
                            </div>
                        </Repeater>
                    </div>

                    <Legend style="margin-top: 1rem; background: #fcfcfc" />
                </Legend.Scope>

                <p>
                    See how much on a scale from 1 to 5 developers agree with the following statements:
                </p>

                <div>
                    <Svg style="width:100%; height:400px;">
                        <Chart
                            offset="20 -20 -40 10"
                            axes={{
                                x: { type: NumericAxis, snapToTicks: 0, max: 5, min: 1 },
                                y: { type: CategoryAxis, vertical: true, hidden: true, inverted: true }
                            }}
                        >
                            <Repeater records:bind="$lane.js.data">
                                <Bar
                                    colorIndex:expr="{$index}*2"
                                    x:bind="$record.avgScore"
                                    y:bind="$record.text"
                                    x0={1}
                                >
                                    <SvgText bind="$record.text" anchors="0.5 0 0.5 0" dy="0.4em" dx="0.5em" />
                                </Bar>
                            </Repeater>
                        </Chart>
                    </Svg>
                </div>

            </div>
        </Repeater>
        <div class="e-report-more">
            <Button onClick="addLane">+</Button>
        </div>
        <CxCredit />
    </div>
</cx>;