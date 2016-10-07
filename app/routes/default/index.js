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
import {SectionStatus} from '../../components/SectionStatus';

export default <cx>
    <div controller={Controller}>
        <div class="b-report">
            <Repeater records:bind="$page.lanes" recordName="$lane">
                <div class="e-report-lane" controller={LaneController}>
                    <div class="b-loading" visible:expr="!{$page.ready}">
                        Loading...
                    </div>
                    <div visible:expr="{$page.ready}">
                        <LookupField
                            mod="project"
                            placeholder="Pick a project"
                            options:bind="$page.projects"
                            value:bind="$lane.id"
                            text:bind="$lane.name"
                            optionTextField="name"
                            required
                            dropdownOptions={{
                                positioning: 'auto'
                            }} />
                    </div>

                    <SectionStatus status:bind="$lane.answers.status">
                        <Svg style="width:100%; height:200px;">
                            <Chart
                                offset="20 -20 -40 10"
                                axes={{
                                    x: {type: NumericAxis, snapToTicks: 0},
                                    y: {type: CategoryAxis, vertical: true, hidden: true}
                                }}
                            >
                                <Repeater records:bind="$lane.answers.data">
                                    <Bar
                                        colorIndex:expr="14 - {$index}"
                                        x:bind="$record.count"
                                        y:bind="$record.text"
                                    >
                                        <SvgText bind="$record.text" anchors="0.5 0 0.5 0" dy="0.35em" dx="0.5em"/>
                                    </Bar>
                                </Repeater>
                            </Chart>
                        </Svg>
                    </SectionStatus>
                    <SectionStatus class="e-report-percentages" status:bind="$lane.percentages.status">
                        <div>
                            <Svg style="width:100px;height:100px;">
                                <PieChart>
                                    <PieSlice value:bind="$lane.percentages.data.used" r={90} r0={70} colorIndex={7}/>
                                    <PieSlice value:expr="1-{$lane.percentages.data.used}" r={90} r0={70}/>
                                </PieChart>
                                <SvgText
                                    tpl="{$lane.percentages.data.used:p;0}"
                                    style="font-size: 20px"
                                    dy="0.35em"
                                    ta="middle"/>
                            </Svg>
                            <div preserveWhitespace>
                                of all participants already used <span text:bind="$lane.name"/>.
                            </div>
                        </div>
                        <div>
                            <Svg style="width:100px;height:100px;">
                                <PieChart>
                                    <PieSlice value:bind="$lane.percentages.data.interested" r={90} r0={70}
                                              colorIndex={9}/>
                                    <PieSlice value:expr="1-{$lane.percentages.data.interested}" r={90} r0={70}/>
                                </PieChart>
                                <SvgText
                                    tpl="{$lane.percentages.data.interested:p;0}"
                                    style="font-size: 20px"
                                    dy="0.35em"
                                    ta="middle"/>
                            </Svg>
                            <div preserveWhitespace>
                                of all participants would use <span text:bind="$lane.name"/> again or would like to learn
                                it.
                            </div>
                        </div>
                    </SectionStatus>
                    <SectionStatus status:bind="$lane.satisfaction.status">
                        <h3 text:tpl="Participants who used {$lane.name} before and would like to use it again also said..."/>
                        <p text:bind="$lane.satisfaction.data.question"/>

                        <Legend.Scope>
                            <Svg style="width:100%; height:20px;">
                                <Chart
                                    axes={{
                                        x: {type: NumericAxis, snapToTicks: 0, hidden: true},
                                        y: {type: CategoryAxis, vertical: true, hidden: true}
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
                                    <SvgText tpl="avg: {$lane.satisfaction.data.average:n;2}" dy="0.35em" dx="-0.5em"
                                             anchors="0.5 1 0.5 1" textAnchor="end"/>
                                </Chart>
                            </Svg>
                            <Legend />
                        </Legend.Scope>

                    </SectionStatus>
                    <SectionStatus status:bind="$lane.related.status">

                        <p text:tpl="Top 10 things that participants used before and want to use again, other than {$lane.name}:"/>
                        <Svg style="width:100%; height:300px;">
                            <Chart
                                offset="20 -20 -40 10"
                                axes={{
                                    x: {type: NumericAxis, snapToTicks: 0},
                                    y: {type: CategoryAxis, vertical: true, hidden: true, inverted: true}
                                }}
                            >
                                <Repeater records:bind="$lane.related.data">
                                    <Bar
                                        colorIndex={12}
                                        x:bind="$record.score"
                                        y:bind="$record.name"
                                    >
                                        <SvgText bind="$record.name" anchors="0.5 0 0.5 0" dy="0.35em" dx="0.5em"/>
                                    </Bar>
                                </Repeater>
                            </Chart>
                        </Svg>
                    </SectionStatus>
                    <SectionStatus status:bind="$lane.features.status">
                        <p>Importance of features and tools:</p>

                        <Legend.Scope>
                            <div class="e-report-features">
                                <Repeater records:bind="$lane.features.data">
                                    <div class="e-report-feature">
                                        <Svg style="width:100%; height:100px;">
                                            <Chart
                                                axes={{
                                                    y: {
                                                        type: NumericAxis,
                                                        snapToTicks: 0,
                                                        vertical: true,
                                                        hidden: true
                                                    },
                                                    x: {type: CategoryAxis, hidden: true}
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
                                        <Text bind="$record.text"/>
                                    </div>
                                </Repeater>
                            </div>

                            <Legend style="margin-top: 1rem; background: #fcfcfc"/>
                        </Legend.Scope>
                    </SectionStatus>
                    <SectionStatus status:bind="$lane.js.status">
                        <p>
                            How much on a scale from 1 to 5 participants agree with the following statements:
                        </p>

                        <Svg style="width:100%; height:400px;">
                            <Chart
                                offset="20 -20 -40 10"
                                axes={{
                                    x: {type: NumericAxis, snapToTicks: 0, max: 5, min: 1},
                                    y: {type: CategoryAxis, vertical: true, hidden: true, inverted: true}
                                }}
                            >
                                <Repeater records:bind="$lane.js.data">
                                    <Bar
                                        colorIndex:expr="{$index}*2"
                                        x:bind="$record.avgScore"
                                        y:bind="$record.text"
                                        x0={1}
                                    >
                                        <SvgText bind="$record.text" anchors="0.5 0 0.5 0" dy="0.35em" dx="0.5em"/>
                                    </Bar>
                                </Repeater>
                            </Chart>
                        </Svg>
                    </SectionStatus>   

                    <SectionStatus status:bind="$lane.dev.status">
                        <p>Developer profiles:</p>
                        <div class="e-report-devinfos">
                            <Repeater records:bind="$lane.dev.data">
                                <div class="e-report-devinfo">
                                    <Svg style="width:100%; height:250px;">
                                        <Chart
                                            offset="20 -20 -20 10"
                                            axes={{
                                                x: {type: NumericAxis, snapToTicks: 0},
                                                y: {type: CategoryAxis, vertical: true, hidden: true}
                                            }}
                                        >
                                            <Repeater records:bind="$record.scores">
                                                <Bar
                                                    colorIndex:expr="13 - {$index}"
                                                    x:bind="$record.count"
                                                    y:bind="$record.text"
                                                >
                                                    <SvgText bind="$record.text" anchors="0.5 0 0.5 0" dy="0.35em" dx="0.5em"/>
                                                </Bar>
                                            </Repeater>
                                        </Chart>                                        
                                    </Svg>
                                    <Text bind="$record.text"/>                                    
                                </div>
                            </Repeater>
                        </div>
                    </SectionStatus>
                    <br/>
                    <SectionStatus status:bind="$lane.spacetabs.status" style="text-align: center">
                        <Svg style="width:100%; height:40px;">
                            <Chart
                                axes={{
                                    x: {type: NumericAxis, snapToTicks: 0, hidden: true},
                                    y: {type: CategoryAxis, vertical: true, hidden: true}
                                }}
                            >
                                <Repeater records:bind="$lane.spacetabs.data.scores">
                                    <Bar
                                        colorIndex:expr="10 - 5 * {$index}"
                                        x:bind="$record.share"
                                        name:bind="$record.id"
                                        style="stroke-width: 0"
                                        y="sat"
                                        stacked
                                    >
                                    </Bar>
                                </Repeater>
                                <SvgText expr="{$lane.spacetabs.data.scores}[0].text" dy="0.35em" dx="-0.5em"
                                         anchors="0.5 1 0.5 1" textAnchor="end"/>
                                <SvgText expr="{$lane.spacetabs.data.scores}[1].text" dy="0.35em" dx="0.5em"
                                         anchors="0.5 1 0.5 0" textAnchor="start"/>
                            </Chart>
                        </Svg>
                        <Text expr="{$lane.spacetabs.data.question}" />
                    </SectionStatus>
                    <br/>
                </div>
            </Repeater>
            <div class="e-report-more">
                <Button onClick="addLane" style="width:30px">+</Button>
                <br/>
                <br/>
                <Button onClick="removeLane" style="width:30px">-</Button>
            </div>
        </div>
    </div>
</cx>;