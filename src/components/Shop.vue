<template>
    <div>
        <h4>Shop</h4>
        <hr>
        <span v-for="(upgrade,index) in upgrades" :key="index">
            <div class="card mb-2" v-if="reachedShowAt(upgrade) && !upgrade.bought">
                <div class="card-header">
                    {{ upgrade.name }}
                </div>
                <div class="card-body" >
                    <p class="card-text">{{ upgrade.description }}</p>
                    <div class="row">
                        <div class="col-md-6">
                            <button class="btn btn-success btn-sm" :disabled="money< upgrade.cost || bugs < upgrade.unlock" v-if="!upgrade.bought" @click="buy(upgrade)">
                                Buy ${{ upgrade.cost }}
                            </button>
                        </div>
                        <div class="col-md-6" style="text-align:right;" v-if="!reachedUnlock(upgrade) || upgrade.unlock != -1">
                            <p class="card-text text-danger">
                                <i className="fa fa-lock"></i> Unlocks at {{upgrade.unlock}} bugs
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </span>
    </div>
</template>

<script>
export default {
    components: {
    },
    props: {
        money: {
            type: Number,
            required: true
        },
        bugs: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            upgrades: [
                {
                    name: "Basic Beetle Buyer Bot",  
                    id: "autoBugBuyer",
                    bought: false,
                    cost: 10,
                    showAt:10,
                    unlock: 25,
                    description: "Buys 1 bug every second"
                },
                {
                    name: "Super Specimen Seller",
                    id: "autoBugSeller",
                    bought: false,
                    cost: 50,
                    showAt:40,
                    unlock: 100, 
                    description: "Sells bugs every second (configurable)"
                },
                {
                    name: "Slightly Larger Feed Bag",
                    bought: false,
                    cost: 25,
                    showAt:35,
                    unlock: 50,
                    description: "50 total food slots"
                },
                {
                    name: "Fully Functional Food Filler",
                    id: "autoFoodFiller",
                    bought: false,
                    cost: 50,
                    showAt:100,
                    unlock: 200,
                    description: "Fills food bag every 3 seconds"
                },
                {
                    name: "High Quality Insects",
                    bought: false,
                    cost:25,
                    showAt:50,
                    unlock: 100,
                    description: "Bugs sell for 25% more"
                },
                {
                    name: "Ohh a shiny one!",
                    bought: false,
                    cost:200,
                    showAt:100,
                    unlock: 200, 
                    description: "Every 10th bug sold sells for 5x"
                }
            ]

        }
    },
    methods: { 
        buy(upgrade) {
            upgrade.bought = true;
            this.$emit('buy', upgrade);
        },
        reachedShowAt(upgrade) {
            if(this.bugs >= upgrade.showAt){
                upgrade.showAt = -1;
            }
            if(upgrade.showAt == -1)
                return true;
            return false;
        },
        reachedUnlock(upgrade) {
            if(this.bugs >= upgrade.unlock){
                upgrade.unlock = -1;
            }
            if(upgrade.unlock == -1)
                return true;
            return false;
        }
    }
}
</script>

<style scoped>
.trBtn{
    position: absolute; 
    top: 4px; 
    right: 5px
}
</style>