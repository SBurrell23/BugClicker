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
                            <button class="btn btn-success btn-sm" style="float:right" :disabled="canNotAffordUpgrade(upgrade)" @click="buy(upgrade)">
                                <i className="fa fa-shopping-cart"></i><i>&nbsp;{{displayCosts(upgrade.cost)}}</i>
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
            upgrade.cost.forEach((value, index) => {
                if (index % 2 === 0) {
                    const cost = value;
                    const resourceType = upgrade.cost[index + 1];
                    this.$parent.resources[resourceType].value -= cost;
                }
            });
            upgrade.executes.forEach(({ funcName, args }) => {
                if (typeof this[funcName] === 'function')
                    this[funcName](...args);
                else 
                    console.error(`Function ${funcName} not found.`);
            });
        },
        canNotAffordUpgrade(upgrade){
            return upgrade.cost.some((value, index) => {
                if (index % 2 === 0) {
                    const cost = value;
                    const resourceType = upgrade.cost[index + 1];
                    return this.$parent.resources[resourceType].value < cost;
                }
            });
        },
        displayCosts(cost) {
            const formattedCosts = [];
            for (let index = 0; index < cost.length; index += 2) {
                const value = cost[index];
                const resourceType = cost[index + 1];
                formattedCosts.push(`${value} ${resourceType}`);
            }
            return formattedCosts.join(' / ');
        },
        increaseProduction(resourceType, amount, factoryName) {
            console.log(`Increasing production of ${resourceType} by ${amount}% for ${factoryName}.`);
            var factories = this.$parent.factories;
            var factory = factories.find(factory => factory.name === factoryName);
            var product = factory.production.find(product => product.type === resourceType);
            const increase = product.rate * (amount / 100);
            product.rate += increase; //increase the factory output
            this.$parent.resources[resourceType].rate += increase; //increase the resource output

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