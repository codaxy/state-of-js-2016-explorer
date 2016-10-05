import CalculateWorker from "worker!./Calculator.js";
import PromiseWorker from 'promise-worker';

var calculator = new CalculateWorker();

const worker = new PromiseWorker(calculator);

export default function (msg) {
    return worker.postMessage(msg);
}