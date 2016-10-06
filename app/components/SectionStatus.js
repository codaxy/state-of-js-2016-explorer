import {VDOM, Widget} from 'cx/ui/Widget';
import {PureContainer} from 'cx/ui/PureContainer';

export class SectionStatus extends PureContainer {

    declareData() {
        super.declareData(...arguments, {
           status: undefined
        });
    }

    prepareData(context, instance) {
        var {data} = instance;
        if (data.status)
            data.stateMods = {
                [data.status]: true
            };
        super.prepareData(context, instance);
    }

    explore(context, instance) {
        var {data} = instance;
        if (data.status == 'ok')
            super.explore(context, instance);
    }

    prepare(context, instance) {
        var {data} = instance;
        if (data.status == 'ok')
            super.prepare(context, instance);
    }

    cleanup(context, instance) {
        var {data} = instance;
        if (data.status == 'ok')
            super.cleanup(context, instance);
    }

    render(context, instance, key) {
        var {data} = instance;

        return <div key={key} className={data.classNames} style={data.style}>
            {data.status == "ok" && this.renderChildren(context, instance)}
            {data.status == "loading" && "Loading..."}
            {data.status == "error" && "Error occurred while retrieving data..."}
        </div>
    }
}

SectionStatus.prototype.baseClass = "sectionstatus";
SectionStatus.prototype.styled = true;
