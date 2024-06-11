<template>
    <div class="row" v-if="resources.bugs">
        <div class="col-lg-2" style="text-align: center;">

            <div class="mb-2"><h1>Bugs </h1></div>
            <div class="mb-3"><h1 :style="'color:'+resources.bugs.color"> {{resources.bugs.value}} </h1></div>
            <button class="btn btn-primary btn-sm" @click="collectResource('bugs',1)">Collect Bug</button>
            
            <h4 class="mt-5 mb-3" v-if="Object.keys(filteredResources).length > 0">Resources<hr></h4>
            <ul class="list-group mb-4">
                <li class="list-group-item d-flex justify-content-between align-items-center" v-for="(resource, index) in filteredResources" :key="index">
                    <span :style="'color:'+resource.color">
                        <b>{{ resource.name }}</b>
                    </span>
                    <span :style="'color:'+resource.color">
                        <b>{{resource.value }}</b>
                    </span>
                </li>
            </ul>

        </div>
        <div class="col-lg-8"> 
            <div class="unselectable">
                <h4>Collectors</h4>
                <hr>
                <div class="mt-4" v-if="!factories[0].unlocked">
                    <p>Get some bugs to earn your first collector!</p>
                </div>
                <div class="mt-2">
                    <div class="row">

                        <div class="col-sm-4 mb-2" v-for="(factory,index) in factories" :key="index" v-show="factory.unlocked">
                            <div class="card mb-2">
                                <div class="card-header">
                                    <b>{{factory.level}}</b> - {{factory.name}}
                                </div>
                                <div class="card-body">
                                    <p class="card-text  mb-2" v-for="(product, pIndex) in factory.production" :key="'product-' + pIndex">
                                        {{resources[product.type].workText}} 
                                        <b v-if="product.rate">{{product.rate}}</b><b v-else>0</b>
                                        <span :style="'color:'+resources[product.type].color"><b>&nbsp;{{producesName(product.type)}}</b></span> /s
                                    </p>
                                    <button class="btn btn-primary btn-sm mt-2" @click="upgradeFactory(index)" :disabled="isUpgradeDisabled(factory)">
                                        {{ factory.buyText }} &nbsp;<i> - {{ showCosts(factory.costs) }}</i>
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
        <div class="col-lg-2">
            <Shop ref="shop" :upgrades="upgrades"/>
        </div>
    </div>
</template>

<script>
import resources from '../assets/resources.json';
import factories from '../assets/factories.json';
import upgrades from '../assets/upgrades.json';
import Shop from './Shop.vue';

export default {
    components: {
        Shop
    },
    props: {},
    computed: {
        filteredResources() {
            return Object.fromEntries(
                Object.entries(this.resources)
                .slice(1) // Skip the first entry
                .filter(([key, value]) => value.unlocked)
            );
        }
    },
    data() {
        return {
            timeout: null,
            startTime: 0,
            second: 0,
            resources:{},
            factories:[],
            upgrades:[],
            defaultGeometricProgression: 1.15
        };
    },
    methods: {
        collectResource(type,num) {
            this.resources[type].value += num;
        },
        upgradeFactory(index) {
            var factory = this.factories[index];
            factory.level++;

            // Deduct cost and increment cost
            factory.costs.forEach(cost => {
                if(!cost.currentCost) //currentCost is not set until a factory is lvl 1
                    cost.currentCost = cost.startingCost;
                this.resources[cost.type].value -= cost.currentCost;
                var gp = !cost.geometricProgression ? this.defaultGeometricProgression : cost.geometricProgression;
                cost.currentCost = Math.round(cost.startingCost * Math.pow(gp, factory.level));
            });

            // Update production rates and increment rates
            factory.production.forEach(product => {
                if(!product.rate) //Rate is not set until a factory is lvl 1
                    product.rate = 0;
                this.resources[product.type].rate += product.increment;
                product.rate = this.roundToTwoDecimals(product.rate + product.increment);

                // Also check and unlock the resource if it's the first factory to produce this resource
                if (!this.resources[product.type].unlocked)
                    this.resources[product.type].unlocked = true;
            });

        },
        checkForUnlocks() {
            this.factories.forEach(factory => {
                if (factory.unlocked) 
                    return;
                if(
                    this.resources[factory.unlockAt[1]].value >= factory.unlockAt[0] || 
                    this.resources[factory.unlockAt[1]].accumulator >= factory.unlockAt[0]
                )
                    factory.unlocked = true;
            });
        },
        producesName(produces){
            return this.resources[produces].name;
        },
        isUpgradeDisabled(factory) {
            return factory.costs.some(cost => {
                if (cost.currentCost == undefined && this.resources[cost.type].value < cost.startingCost) 
                    return true;
                return this.resources[cost.type].value < cost.currentCost;
            });
        },
        showCosts(costs) {
            return costs.map(cost => 
                `${cost.currentCost == undefined ? cost.startingCost : cost.currentCost} ${this.producesName(cost.type)}`
            ).join(', ');
        },
        roundToTwoDecimals(num) {
            return Math.round(num * 100) / 100;
        },
        updatePageTitle() {
            document.title = "Bug Clicker - " + this.resources.bugs.value.toFixed(0);
        },
        collectResources(){
            for (const key in this.resources) {
                const res = this.resources[key];
                res.accumulator += res.rate / 10; //This must multiply with the refresh interval to equal 100

                // Show whole resources only
                if (res.accumulator >= 1) {
                    const wholeResources = Math.floor(res.accumulator);
                    this.collectResource(key, wholeResources);
                    res.accumulator -= wholeResources;
                }
            }
        },
        setupResources(){
            //This function sets default keys for all the currently still locked resources
            //This reduces clutter in the resources.json file
            for (const key in this.resources) {
                const resource = this.resources[key];
                if (resource.unlocked == undefined) {
                    resource.value = 0;
                    resource.rate = 0;
                    resource.accumulator = 0;
                    resource.unlocked = false;
                }
            }
        },
        gameLoop(){
            this.second += 100; //Used to track seconds
            this.collectResources();
            if(this.second >= 500){
                this.checkForUnlocks();
                this.updatePageTitle();
                this.second = 0;
            }
            this.timeout = setTimeout(this.gameLoop, 100);
        }
    },
    mounted() {
        this.resources = resources;
        this.factories = factories;
        this.upgrades = upgrades;
        this.setupResources();

        this.startTime = new Date().getTime();
        this.gameLoop();

    },
    unmount() {
        clearTimeout(this.timeout);
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
.list-group-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>