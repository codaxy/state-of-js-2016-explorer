import {Controller} from 'cx/ui/Controller';
import backCalc from '../../data/Worker';
import {append} from 'cx/data/ops/append';



export default class extends Controller {
    init() {
        super.init();

        this.store.init('$page.lanes', [{}, {}]);

        backCalc({
            type: 'getTopics',
            filter: {
                type: 'project'
            }
        }).then(data => this.store.init('$page.projects', data));
    }

    addLane() {
        this.store.update('$page.lanes', append, {});
    }
}