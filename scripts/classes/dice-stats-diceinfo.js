
//Storage Class for Each Die
//Die rolls are stored in array thats size of the die type 
//That way can just incrament each position rather then store array of increasing size
//Ex, D20 roll was 16 -> Rolls[(16-1)]++;
class DIE_INFO {
    TYPE =          0;  //Type of die <DIE_TYPE> varable
    TOTAL_ROLLS =   0;
    ROLLS =         []; //Array size of die 
    BLIND_ROLLS = [];
    STREAK_SIZE =   -1;
    STREAK_INIT =   -1;
    STREAK_ISBLIND = false;
    LONGEST_STREAK =        -1;
    LONGEST_STREAK_INIT =   -1;

    MEAN =      0.0; //(avg)
    MEDIAN =    0;
    MODE =      0;

    /**
     * constructor set values to defaults
     * @param {int} dieMax - max value the die can be
     */
    constructor(dieMax = 100){
        this.TYPE = MAX_TO_DIE.get(dieMax);
        this.STREAK_SIZE = -1;
        this.STREAK_INIT = -1;
        this.LONGEST_STREAK = 0;
        this.LONGEST_STREAK_INIT = 0;

        this.ROLLS = new Array(dieMax);
        this.ROLLS.fill(0);

        this.BLIND_ROLLS = new Array(dieMax);
        this.BLIND_ROLLS.fill(0);
    }

    /**
     * Update and save streak info (Streaks are series of incrementing dice rolls)
     * @param {int} currentRoll - current die roll value
     * @param {bool} isBlind was the roll a blind roll or not
     */
    updateStreak(currentRoll, isBlind){
        //Streak Size will always be at least 1 unless its right after initalization
        if(this.STREAK_INIT + this.STREAK_SIZE != currentRoll){
            //Streak resets
            this.STREAK_SIZE = 1;
            this.STREAK_INIT = currentRoll;
            this.STREAK_ISBLIND = isBlind;
        }else{
            //Streak Incramented
            this.STREAK_SIZE++;
            this.STREAK_ISBLIND = this.STREAK_ISBLIND || isBlind;
            //Check if longest streak and update if it is
            if(this.STREAK_SIZE > this.LONGEST_STREAK){
                this.LONGEST_STREAK = this.STREAK_SIZE;
                this.LONGEST_STREAK_INIT = this.STREAK_INIT;
            }
        }
    }

    /**
     * Clear all die info
     */
    clearData(){
        this.TOTAL_ROLLS =   0;
        this.ROLLS.fill(0);
        this.BLIND_ROLLS.fill(0);

        this.STREAK_SIZE =   -1;
        this.STREAK_INIT =   -1;
        this.STREAK_ISBLIND = false;
        this.LONGEST_STREAK =        -1;
        this.LONGEST_STREAK_INIT =   -1;

        this.MEAN =      0.0;
        this.MEDIAN =    0;
        this.MODE =      0;
    }

    /**
     * A roll was made with this die so update the value that was rolled
     * @param {int} roll - value of roll 
     * @param {bool} isBlind 
     */
    addRoll(roll, isBlind){
        this.TOTAL_ROLLS++;
        this.updateStreak(roll, isBlind)

        var dontHideBlindRolls = game.settings.get(MODULE_ID_DS,SETTINGS.SHOW_BLIND_ROLLS_IMMEDIATE);
        if(!isBlind || dontHideBlindRolls){
            this.ROLLS[roll-1] = this.ROLLS[roll-1]+1;
        }else{
            this.BLIND_ROLLS[roll-1] = this.BLIND_ROLLS[roll-1]+1; 
        }
    }

    /**
     * Calculate mean median and mode for the die
     */
    calculate(){
        this.MEAN = DICE_STATS_UTILS.getMean(this.ROLLS);
        this.MEDIAN = DICE_STATS_UTILS.getMedian(this.ROLLS);
        this.MODE = DICE_STATS_UTILS.getMode(this.ROLLS);
    }

    /**
     * method to take blind roll data and push it into normal roll data
     * Reset blind roll data once pushed
     */
    pushBlindRolls(){
        for(let i=0; i<this.BLIND_ROLLS.length; i++){
            this.ROLLS[i] = this.ROLLS[i]+this.BLIND_ROLLS[i];
            this.BLIND_ROLLS[i]=0;
        }
    }

    /**
     * method to get total number of blind rolls
     * @returns {int} - total number of blind rolls for this die
     */
    getBlindRollsCount(){
        let tempRollCount = 0;
        for(let i=0; i<this.BLIND_ROLLS.length; i++){
            tempRollCount += this.BLIND_ROLLS[i];
        }

        return tempRollCount;
    }
}
