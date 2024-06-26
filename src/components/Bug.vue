<template>
    <div class="row" v-if="resources.bugs">
        <div class="col-lg-3" style="text-align: center;">

            <div class="mb-2"><h1>Bugs </h1></div>
            <div class="mb-3"><h1 :style="'color:'+resources.bugs.color"> {{resources.bugs.value}} </h1></div>
            <button class="btn btn-primary btn-sm mb-3 me-2" @click="collectResource('bugs',100000000)">Collect Bug</button>
            <button class="btn btn-danger btn-sm mb-3" @click="wipeSave()">Wipe Save</button>
            
            <h4 class="mt-4 mb-3" v-if="Object.keys(filteredResources).length > 0">Resources<hr></h4>
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
        
        <div class="col-lg-9">
            <nav class="nav nav-tabs d-flex justify-content-between mb-4">
                <div class="d-flex">
                    <a class="nav-link bigger-link" :class="{'active':tab=='collectors'}" @click="switchTabs('collectors')">
                        <i className="fa fa-bugs"></i> Collectors
                    </a>
                    <a class="nav-link"  :class="{'active':tab=='hatchery','disabled':!isFactoryUnlocked('Queen Termite Nest')}" @click="switchTabs('hatchery')">
                        <i className="fa fa-egg"></i> Hatchery
                    </a>
                    <a class="nav-link" :class="{'active':tab=='pavillion','disabled':!isFactoryUnlocked('Flower Field')}" @click="switchTabs('pavillion')">
                        <i className="fa fa-flask-vial"></i> Pavillion
                    </a>
                    <a class="nav-link":class="{'active':tab=='web'}" @click="switchTabs('web')">
                        <i className="fa fa-spider"></i> The Web
                    </a>
                    <a class="nav-link disabled">
                        <i className="fa fa-refresh"></i> Exchange
                    </a>
                </div>
                <a class="nav-link bigger-link" :class="{'active': tab=='shop'}" @click="switchTabs('shop')">
                    <i className="fa fa-shopping-cart"></i> Shop  &nbsp;<span class="badge rounded-pill bg-success" v-if="this.numShopUpgrades != 0">{{this.numShopUpgrades}}</span>
                </a>
            </nav>

            <div v-show="tab == 'collectors'"> 
                <div class="unselectable">
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
                                        <button class="btn btn-outline-primary btn-sm mt-2" @click="upgradeFactory(index)" :disabled="isUpgradeDisabled(factory)">
                                            {{ factory.buyText }}<i> -  {{ showCosts(factory.costs) }}</i>
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <div v-show="tab == 'hatchery'">
                <Hatchery ref="hatchery"/>
            </div>
            <div v-show="tab == 'pavillion'">
                <Pavillion ref="pavillion"/>
            </div>
            <div v-show="tab == 'web'">
                <Web ref="web"/>
            </div>
            <div v-show="tab == 'shop'">
                <Shop ref="shop" :upgrades="upgrades"/>
            </div>
        </div>
    </div>
</template>

<script>
import resources from '../assets/resources.json';
import factories from '../assets/factories.json';
import upgrades from '../assets/upgrades.json';
import Shop from './Shop.vue';
import Hatchery from './Hatchery.vue';
import Pavillion from './Pavillion.vue';
import Web from './Web.vue';

export default {
    components: {
        Shop,
        Hatchery,
        Pavillion,
        Web
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
            seconds: 0,
            tab:"collectors",
            numShopUpgrades: 0,
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

            // Deduct cost and increase cost based on GP
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
                this.resources[product.type].value += 1000000000; //DEBGUG ONLY!!! REMOVE FOR PRODUCTION!!!

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
        isFactoryUnlocked(factoryToCheck) {
            const factory = this.factories.find(f => f.name === factoryToCheck);
            if (factory && factory.unlocked) 
                return true;
            else
                return false;
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
        switchTabs(tab){
            this.tab = tab;
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
        checkShopForUpgrades(){
            if(this.$refs.shop)
                this.numShopUpgrades = this.$refs.shop.numberOfAvailableUpgrades();
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
        saveData(){
            const data = {
                resources: this.resources,
                factories: this.factories,
                upgrades: this.upgrades
            };
            localStorage.setItem('gameData', JSON.stringify(data));
        },
        loadData(){
            const data = JSON.parse(localStorage.getItem('gameData'));
            if (data) {
                for (const key in data.resources) {
                    if (key !== 'name' && key !== 'color' && key !== 'workText') {
                        this.resources[key] = data.resources[key];
                    }
                }
                if (data.factories) {
                    data.factories.forEach(factory => {
                        const existingFactory = this.factories.find(f => f.name === factory.name);
                        if (existingFactory) {
                            existingFactory.level = factory.level;
                            existingFactory.unlocked = factory.unlocked;
                            existingFactory.production = factory.production;
                            existingFactory.buyText = factory.buyText;
                            existingFactory.costs = factory.costs;
                        } else {
                            this.factories.push(factory);
                        }
                    });
                }
                this.upgrades = data.upgrades;
            }
        },
        wipeSave(){
            localStorage.removeItem('gameData');
            location.reload();
        },
        gameLoop(){
            this.collectResources();
            if(this.seconds % 500 == 0){
                this.checkForUnlocks();
                this.checkShopForUpgrades();
            }
            if(this.seconds % 1000 == 0)
                this.updatePageTitle();
            if(this.seconds % 3000 == 0)
                this.saveData();
            
            this.seconds += 100; //Used to track seconds
            this.timeout = setTimeout(this.gameLoop, 100);
        }
    },
    mounted() {
        this.resources = resources;
        this.factories = factories;
        this.upgrades = upgrades;
        this.loadData();
        this.setupResources();
        this.checkForUnlocks();

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
.nav-link{
    cursor: pointer;
    text-align: center;
}
@media (min-width: 850px) {
    .nav-link{
        min-width: 135px;
    }
}
@media (min-width: 850px) {
    .bigger-link{
        min-width: 200px;
    }
}
</style>