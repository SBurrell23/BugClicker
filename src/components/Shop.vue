<template>
    <div>
        <h4>Shop</h4>
        <hr>
        <span v-for="(upgrade,index) in upgrades" :key="index">
            <div class="card mb-2">
                <div class="card-body" >
                    <h5 class="card-title"> {{ upgrade.name }}</h5>
                    <p class="card-text">{{ upgrade.description }}</p>
                    <div class="row">
                        <div class="col-md-12">
                            <button class="btn btn-success btn-sm" style="float:right" :disabled="money< upgrade.cost || bugs < upgrade.unlock" v-if="!upgrade.bought" @click="buy(upgrade)">
                                <i className="fa fa-shopping-cart"></i> {{ upgrade.cost }} {{ upgrade.costType }}
                            </button>
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
                    name: "Good Workers",  
                    id: "goodWorkers",
                    bought: false,
                    cost: 10,
                    costType: "bugs",
                    showAt:10,
                    unlock: 25,
                    description: "Worker Ants collect bugs 25% faster"
                },
                {
                    name: "Birthing Hips",
                    id: "birthingHips",
                    bought: false,
                    cost: 1000,
                    costType: "eggs",
                    showAt:40,
                    unlock: 100, 
                    description: "Queen Termites egg production is doubled."
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