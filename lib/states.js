var states;
states = [];

function current() {
    return states[states.length - 1];
}
function dup(original) {
    var property, state;
    state = {};
    for (property in original) {
        if (original.hasOwnProperty(property)) {
            state[property] = original[property];
        }
    }
    return state;
}
function push(options) {
    if (options == null) options = {};
    var property, state;
    state = dup(current());
    for (property in options) {
        if (options.hasOwnProperty(property)) {
            state[property] = options[property];
        }
    }
    states.push(state);
}
function pull() {
    return states.pop();
}
function withState(options, callback) {
    if (options == null) options = {};
    push(options);
    callback();
    return pull();
}
module.exports = {
    push: push,
    pull: pull,
    current: current,
    withState: withState
};