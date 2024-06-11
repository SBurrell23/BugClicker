<template>
    <div>
        <h4>Shop</h4>
        <hr>
        <span v-for="(upgrade,index) in upgrades" :key="index">
            <div class="card mb-2" v-if="upgrade.shown && !upgrade.bought">
                <div class="card-body" >
                    <h5 class="card-title"> {{ upgrade.name }}</h5>
                    <p class="card-text">{{ upgrade.description }}</p>
                    <div class="row">
                        <div class="col-md-12">
                            <button class="btn btn-success btn-sm" style="float:right" :disabled="money< upgrade.cost || bugs < upgrade.unlock" v-if="!upgrade.bought" @click="buy(upgrade)">
                                <i className="fa fa-shopping-cart"></i> {{ displayCosts(upgrade.cost)}}
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
        upgrades: {
            type: Array,
            required: true
        },
    },
    data() {
        return {
            timeout: null,
        }
    },
    methods: { 
        buy(upgrade) {
            upgrade.bought = true;

            upgrade.executes.forEach(({ funcName, args }) => {
                if (typeof this[funcName] === 'function')
                    this[funcName](...args);
                else 
                    console.error(`Function ${funcName} not found.`);
            });
        },
        increaseProduction(resourceType, amount, factoryName) {
            console.log(`Increasing production of ${resourceType} by ${amount}% for ${factoryName}.`);
            var factories = this.$parent.factories;
            var factory = factories.find(factory => factory.name === factoryName);
            var product = factory.production.find(product => product.type === resourceType);
            const increase = product.rate * (amount / 100);
            product.rate += increase;
            this.$parent.resources[resourceType].rate += increase;

        },
        displayCosts(cost) {
            const [price, resourceType] = cost;
            return price + " " + this.$parent.resources[resourceType].name;
        },
        checkForUpgrades() {
            this.upgrades.forEach(upgrade => { 
                const [requiredAmount, resourceType] = upgrade.unlockAt;
                if (this.$parent.resources[resourceType].value >= requiredAmount){
                    upgrade.shown = true;
                    this.$forceUpdate();
                }
            });
            this.timeout = setTimeout(this.checkForUpgrades, 1000);
        },
        startLoop() {
            this.checkForUpgrades();
        },
        endLoop() {
            clearTimeout(this.timeout);
        }
    },
    mounted() {
        this.startLoop();
    },
    unmounted() {
        this.endLoop();
    }
}
</script>

<style scoped>
</style>