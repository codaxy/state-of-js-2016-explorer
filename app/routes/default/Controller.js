import {Controller} from 'cx/ui/Controller';
import backCalc from '../../data/Worker';
import {append} from 'cx/data/ops/append';
import {GlobalCacheIdentifier} from 'cx/util/GlobalCacheIdentifier'



export default class extends Controller {
    init() {
        super.init();

        this.store.init('$page.ready', false);
        this.store.init('$page.lanes', [{}, {}]);

        backCalc({
            type: 'getTopics',
            filter: {
                type: 'project'
            }
        }).then(data => {
            this.store.init('$page.projects', data);
            var lanes = this.store.get('$page.lanes');
            if (lanes.length == 2 && lanes[0].id == null)
                this.store.set('$page.lanes', [{
                    id: 1,
                    name: 'ES6'
                }, {}]);
            this.store.set('$page.ready', true);
        });
    }

    addLane() {
        this.store.update('$page.lanes', append, {});
        GlobalCacheIdentifier.change();
    }

    removeLane() {
        this.store.update('$page.lanes', lanes => lanes.slice(0, lanes.length - 1));
        GlobalCacheIdentifier.change();
    }
}