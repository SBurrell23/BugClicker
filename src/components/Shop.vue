<template>
    <div>
        <div class="mt-4" v-if="numberOfAvailableUpgrades() == 0">
            <p> 
                Find more bugs to unlock upgrades!
            </p>
        </div>
        <div class="row">
            <div class="col-6" v-for="(upgrade,index) in filteredUpgrades" :key="index">
                <div class="card mb-2">
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
            </div>
        </div>
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
    computed: {
        filteredUpgrades() {
            return this.upgrades.filter(upgrade => (upgrade.shown && !upgrade.bought));
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
        increaseProduction(resourceType, amount, factoryName) {
            console.log(`Increasing production of ${resourceType} by ${amount}% for ${factoryName}.`);
            var factories = this.$parent.factories;
            var factory = factories.find(factory => factory.name === factoryName);
            var product = factory.production.find(product => product.type === resourceType);
            const rateIncrease = product.rate * (amount / 100);
            const incrementIncrease = product.increment * (amount / 100);
            product.rate += rateIncrease; //increase the factories current output rate
            product.increment += incrementIncrease // increase the future proudction rate increments
            this.$parent.resources[resourceType].rate += rateIncrease; //increase the resource output

        },
        numberOfAvailableUpgrades() {
            return this.upgrades.filter(upgrade => upgrade.shown && !upgrade.bought).length;
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
            return formattedCosts.join(' + ');
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
    },
    mounted() {
        this.checkForUpgrades();
    },
    unmounted() {
        clearTimeout(this.timeout);
    }
}
</script>

<style scoped>
</style>