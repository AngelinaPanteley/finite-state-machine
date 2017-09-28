class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if(config) {
            this.initial = config.initial;
            this.history = [];
            this.history.push(this.initial);
            this.current = 0;
            this.localStorage = [];
            this.states = Object.entries(config.states);
            this.transitions = new Array(this.states.length);
            for(var i=0; i<this.states.length; i++) {
                this.transitions[i]=Object.entries(this.states[i][1].transitions);
            }
            for(var i=0; i<this.states.length; i++) {
                this.states[i]=this.states[i][0];
            }
            var tr = new Array(this.states.length);
            for(var i=0; i<this.states.length; i++) {
                tr[i] = new Array(this.states.length);
                for(var j=0;j<this.states.length; ++j) {
                    tr[i][j]=null;
                }
                for(var j=0;j<this.transitions[i].length; ++j) {
                    tr[i][this.states.indexOf(this.transitions[i][j][1])]=this.transitions[i][j][0];
                }
            }
            this.transitions=tr;
            
        }
        else {
            throw new Error("config is undefined");
        }
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.history[this.current];
    }

    /**https://github.com/AngelinaPanteley/finite-state-machine.git
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if (this.states.indexOf(state)===-1) {
            throw new Error("this state does not exist");
        }
        else {
            this.history.push(state);
            this.current++;
            this.localStorage = [];
        }
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        var current = this.history[this.current];
        var index = this.transitions[this.states.indexOf(current)].indexOf(event);
        if(index===-1) {
            throw new Error('the event does not exist');
        }
        else {
            this.history.push(this.states[index]);
            this.current++;
            this.localStorage = [];
        }
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.history.push(this.initial);
        this.current++;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        var mass = [];
        if (event === undefined) {
            mass=this.states;
        }
        else {
            for(var i=0; i<this.states.length; ++i) {
                var index = this.transitions[i].indexOf(event);
                if(index!==-1) {
                    mass.push(this.states[i]);
                }
            }
        }
        return mass;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if (this.current===0) {
            return false;
        }
        this.localStorage.push(this.history[this.current]);
        this.current--;
        this.history.pop();
        return true;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (this.localStorage.length === 0) {
            return false;
        }
        this.current++;
        this.history.push(this.localStorage[this.localStorage.length-1]);
        this.localStorage.pop();
        return true;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.history = [this.initial];
        this.current=0;
        this.localStorage = [];
    }
}

module.exports = FSM;
