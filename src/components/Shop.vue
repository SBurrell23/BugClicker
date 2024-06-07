<template>
    <div>
        <h4>Shop</h4>
        <hr>
        <div class="card mb-2" v-for="(upgrade,i) in upgrades" :key="i">
            <div class="card-header">
                {{ upgrade.name }}
                <span class="trBtn">
                    <a class="btn btn-secondary btn-sm" @click="buy(upgrade.id)">
                        Buy ${{ upgrade.cost }}
                    </a>
                </span>
            </div>
            <div class="card-body">
                <p class="card-text">{{ upgrade.description }}</p>
                
            </div>
        </div>
    </div>
</template>

<script>
export default {
    components: {
    },
    props: {
    },
    data() {
        return {
            upgrades: [
                {
                    name: "Basic Bug Buying Bot",
                    id: "autoBugBuyer",
                    bought: false,
                    cost: 100,
                    description: "Buys 1 bug every second (upgradeable)"
                },
                {
                    name: "Super Secure Specimen Seller",
                    id: "autoBugSeller",
                    bought: false,
                    cost: 100,
                    description: "Sells bugs every second (configurable)"
                },
                {
                    name: "Fully Functional Food Fetcher",
                    id: "autoFoodBuyer",
                    bought: false,
                    cost: 100,
                    description: "Purchases food every second (configurable)"
                },
                {
                    name: "High Quality Insects",
                    bought: false,
                    description: "Bugs sell for 25% more"
                },
                {
                    name: "Slightly Larger Feed Bag",
                    bought: false,
                    description: "100 total food slots"
                },
                {
                    name: "Ohh a shiny one!",
                    bought: false,
                    description: "Every 10th bug sold sells for 5x"
                }
            ]

        }
    },
    methods: {
        buy(id) {
            this.$emit('buy',id);
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