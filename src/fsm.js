class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */

    constructor(config) {
       if(config) {
         this.config = config;  
         this.initial = config.initial;
         this.current = this.initial;
         this.history = [this.initial];   
         this.length = 0; 
         this.localStorage = [];
       }
       else 
           throw new Error();
    }
         
    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
       return this.current;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        var flag = false;
        for (let st in this.config.states)
           if (st === state) {
               this.current = state;
               this.history.push(this.current);
               flag = true;
               this.localStorage = [];
           }
        if (!flag)
            throw new Error();
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        var flag = false;  
        for (let st in this.config.states[this.current])
            for (let tr in this.config.states[this.current].transitions)
                if (tr === event){
                    this.current = this.config.states[this.current].transitions[tr];
                    this.history.push(this.current);
                    flag = true;
                    this.localStorage = [];
                }
        if (!flag)
            throw new Error();
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.current = this.initial;
        this.history.push(this.initial);
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        var mass = [];
        if(event) {
            for (let st in this.config.states) {
                for (let tr in this.config.states[st].transitions) {
                    if (tr === event)
                        mass.push(st);
                }
            }
        }
        else
            for (let st in this.config.states)
                mass.push(st);
        return mass;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if (this.history.length<2) 
            return false;
        this.localStorage.push(this.current);
        this.history.pop();
        this.current = this.history[this.history.length-1];
        return true;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (!this.localStorage.length) 
            return false;
        this.history.push(this.localStorage[this.localStorage.length-1]);
        this.current=this.history[this.history.length-1];
        this.localStorage.pop();
        return true;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.history = [this.initial];
        this.current = this.initial;
        this.localStorage = [];
    }
}

module.exports = FSM;
