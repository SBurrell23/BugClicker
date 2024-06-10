<template>
    <div class="row" v-if="resources.bugs">
        <div class="col-sm-2" style="text-align: center;">
            <div class="mb-2 text-success"><h1>Bugs </h1></div>
            <div class="mb-3"><h1> {{resources.bugs.value}} </h1></div>
            <button class="btn btn-primary btn-sm" @click="collectResource('bugs',5)">Collect Bug</button>
            <h3 class="mt-5 mb-3" v-if="Object.keys(filteredResources).length > 0">Resources</h3>
            <ul class="list-group mb-4">
                <li class="list-group-item" v-for="(res,index) in filteredResources" :key="index">
                    {{res.name}} : {{res.value}}
                </li>
            </ul>
        </div>
        <div class="col-sm-8">
            <div class="unselectable">
                
                <div class="mt-2">
                    <div class="row">

                        <div class="col-sm-4" v-for="(factory,index) in factories" :key="index" v-show="factory.unlocked">
                            <div class="card mb-2">
                                <div class="card-header">
                                    <b>{{factory.level}}</b> - {{factory.name}}
                                </div>
                                <div class="card-body">
                                    <p class="card-text">Collecting <b>{{factory.rate}}</b> {{factory.produces}}/second</p>
                                    <button class="btn btn-primary btn-sm" @click="upgradeFactory(index)" :disabled="resources[factory.costType].value < factory.cost">
                                        {{ factory.buyText }} &nbsp;<i>({{factory.cost}} {{factory.costType}})</i>
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
        <div class="col-sm-2">
            <Shop ref="shop" :money="money/100" :bugs="bugs" @buy="buyUpgrade"/>
        </div>
    </div>
</template>

<script>
import resources from '../assets/resources.json';
import factories from '../assets/factories.json';
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
            interval: null,
            startTime: 0,
            second: 0,
            resources:{},
            factories:[],
            items:[]
        };
    },
    methods: {
        collectResource(type,num) {
            this.resources[type].value += num;
        },
        upgradeFactory(index) {
            var factory = this.factories[index];
            this.resources[factory.costType].value -= factory.cost; //Pay the cost
            this.resources[factory.produces].rate += factory.rateIncrement; //Increase the resource rate
            factory.level += 1;
            factory.rate += factory.rateIncrement;
            factory.cost += factory.costIncrement;
            if(this.resources[factory.produces].unlocked == false) //If this is the first factory to producee this resource, unlock it
                this.resources[factory.produces].unlocked = true;
        },
        updatePageTitle() {
            if(this.second >= 1000){
                document.title = "Bug Clicker - " + this.resources.bugs.value.toFixed(0);
                this.second = 0;
            }
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
        }
    },
    mounted() {
        this.resources = resources;
        this.factories = factories;

        this.startTime = new Date().getTime();

        this.interval = setInterval(() => {
            this.second += 100; //Used to track seconds
            this.collectResources();
            this.updatePageTitle();
        }, 100);

    },
    unmount() {
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