<template>
    <div class="unselectable">
        <div class="row mb-4">
            <div class="col-12">
                <div style="margin-left:auto; margin-right:auto;" class="centerText">
                    <h1 style="color:#122c12">Bugs: {{bugs}}</h1>
                    <button class="btn btn-primary mt-2" :disabled="food<bugFoodCost"  @click="collectBug(1)">
                        Collect Bug ({{bugFoodCost}} food)
                    </button>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-6 centerText">
                <h4 class="mt-4">Money: ${{ (money / 100).toFixed(2) }}</h4>
                <button class="btn btn-danger me-2 mb-5" :disabled="bugs<1" @click="sellBug(1)">
                    Sell Bug ${{ (bugSalePrice / 100).toFixed(2) }}
                </button>
            </div>
            <div class="col-6 centerText">
                <h4 class="mb-2 mt-4">Food: {{food}} / {{foodBag}}</h4>
                <button class="btn btn-success" :disabled="money < foodCost * (foodBag - food) || foodBag == food" @click="fillFoodBag()">
                    Fill Food Bag ${{ (foodCost * (foodBag - food) / 100).toFixed(2) }}
                </button> 
            </div>
        </div>

        <div class="mt-2">
        <h4>Upgrades</h4>
        <hr>
        <div class="row">

            <div class="col-sm-4">
                <div class="card mb-2">
                    <div class="card-header">
                        Basic Bug Buying Bot
                    </div>
                    <div class="card-body">
                        <p class="card-text">Collecting <b>{{bps}}</b> bugs/second</p>
                        <button class="btn btn-primary btn-sm" @click="bps += 1">Upgrade $100</button>
                    </div>
                </div>
            </div>

            <div class="col-sm-4">
                <div class="card mb-2">
                    <div class="card-header">
                        Super Secure Specimen Seller
                    </div>
                    <div class="card-body">
                        <p class="card-text">Selling <b>{{sps}}</b> bugs/second</p>
                        <button class="btn btn-primary btn-sm me-2" @click="sps += 1">+1</button>
                        <button class="btn btn-primary btn-sm" @click=" sps > 0 && sps--">-1</button>
                    </div>
                </div>
            </div>

            <div class="col-sm-4">
                <div class="card mb-2">
                    <div class="card-header">
                        Fully Functional Food Filler
                    </div>
                    <div class="card-body">
                        <p class="card-text">Filling bag every {{fps}} seconds</p>
                        <button class="btn btn-primary btn-sm me-2" @click="fps += .1">+.1</button>
                        <button class="btn btn-primary btn-sm" @click="fps -= .1">-.1</button>
                    </div>
                </div>
            </div>

        </div>

    </div>

    </div>
</template>

<script>

export default {
    components: {},
    props: {},
    data() {
        return {
            interval: null,
            elapsed: 0,
            bugs: 0,
            bugFoodCost: 1,
            //-----------------//
            money: 0,  // in cents
            bugSalePrice: 150,  // in cents
            //-----------------//
            food: 10,
            foodBag: 15,
            foodCost: 100,  // in cents
            //-----------------//
            bps: 0,  // bugs per second
            sps: 0,  // sell bugs per second
            fps: 0,  // fill food bag per second
            //-----------------//
            bugAccumulator: 0,
            sellAccumulator: 0
        };
    },
    methods: {
        collectBug(num) {
            if (this.food >= this.bugFoodCost * num) {
                this.bugs += num;
                this.food -= this.bugFoodCost * num;
            }
        },
        sellBug(num) {
            if (this.bugs >= num) {
                this.bugs -= num;
                this.money += this.bugSalePrice * num;
            }
        },
        fillFoodBag() {
            const foodSpotsInBag = this.foodBag - this.food;
            if (this.money >= this.foodCost * foodSpotsInBag) {
                this.money -= this.foodCost * foodSpotsInBag;
                this.food += foodSpotsInBag;
            }
        },
        buyUpgrade(item) {
            if (item == "autoBugBuyer") {
                this.bps += 1;
            }
        }
    },
    created() {
        this.interval = setInterval(() => {
            this.elapsed += 100;
            this.bugAccumulator += this.bps / 10;
            this.sellAccumulator += this.sps / 10;

            // Collect bugs (whole bugs)
            if (this.bugAccumulator >= 1) {
                const wholeBugs = Math.floor(this.bugAccumulator);
                this.collectBug(wholeBugs);
                this.bugAccumulator -= wholeBugs;
            }

            // Sell bugs (whole pennies only)
            if (this.sellAccumulator >= 1) {
                const wholeSales = Math.floor(this.sellAccumulator);
                this.sellBug(wholeSales);
                this.sellAccumulator -= wholeSales;
            }

            // Fill food bag every second
            if (this.elapsed >= 1000 * this.fps && this.fps != 0) {
                this.fillFoodBag();
                this.elapsed = 0; // reset every second
            }
        }, 100);
    },
    destroyed() {
        clearInterval(this.interval);
    }
};

</script>

<style scoped>
.unselectable{
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
.centerText{
    text-align: center;
}
</style>