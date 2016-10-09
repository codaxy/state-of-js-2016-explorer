import {Controller} from 'cx/ui/Controller';
import data from '../../data/precomputed';
import {append} from 'cx/data/ops/append';
import {GlobalCacheIdentifier} from 'cx/util/GlobalCacheIdentifier'



export default class extends Controller {
    init() {
        super.init();

        this.store.init('$page.projects', data.map(p=>({id: p.id, name: p.name})));

        this.store.init('$page.lanes', [{
            id: 1,
            name: 'ES6'
        }, {}]);
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