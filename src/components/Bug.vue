<template>
    <div class="row">
        <div class="col-sm-2" style="text-align: center;">
            <div class="mb-2 text-success"><h1>Bugs </h1></div>
            <div class="mb-3"><h1> {{resource.bugs.value}} </h1></div>
            <button class="btn btn-primary btn-sm" @click="collectResource('bugs',1)">Collect Bug</button>
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
                                    <button class="btn btn-primary btn-sm" @click="upgradeFactory(index)" :disabled="resource[factory.costType].value < factory.cost">
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
            <!-- <Shop ref="shop" :money="money/100" :bugs="bugs" @buy="buyUpgrade"/> -->
        </div>
    </div>
</template>

<script>
import Shop from './Shop.vue';

export default {
    components: {
        Shop
    },
    props: {},
    data() {
        return {
            interval: null,
            startTime: 0,
            second: 0,
            resource:{
                bugs:{
                    name: "Bugs",
                    value: 0,
                    rate: 0,
                    accumulator: 0
                }
            },
            factories:[
                {
                    name: "Worker Ants",
                    level : 0,
                    rate : 0,
                    rateIncrement: 1,
                    produces: "bugs",
                    costType: "bugs",
                    cost: 10,
                    costIncrement: 5,
                    buyText: "Recruit Workers",
                    unlockAt: [0,"bugs"],
                    unlocked: true
                },
                {
                    name: "Builder Ants",
                    level : 0,
                    rate : 0,
                    rateIncrement: 1,
                    produces: "bugs",
                    costType: "bugs",
                    cost: 50,
                    costIncrement: 5,
                    buyText: "Hire Builders",
                    unlockAt: [0,"bugs"],
                    unlocked: true
                }
            ],
            items:[]
        };
    },
    methods: {
        collectResource(type,num) {
            this.resource[type].value += num;
        },
        upgradeFactory(index) {
            var factory = this.factories[index];
            this.resource[factory.costType].value -= factory.cost; //Pay the cost
            this.resource[factory.produces].rate += factory.rateIncrement; //Increase the resource rate
            factory.level += 1;
            factory.rate += factory.rateIncrement;
            factory.cost += factory.costIncrement;
        },
        updatePageTitle() {
            document.title = "Bug Clicker - " + this.resource.bugs.value.toFixed(0);
            this.second = 0;
        }
    },
    mounted() {
        this.startTime = new Date().getTime();

        this.interval = setInterval(() => {
            this.second += 100;
            this.resource.bugs.accumulator += this.resource.bugs.rate / 10;

            // Collect bugs (whole bugs)
            if (this.resource.bugs.accumulator >= 1) {
                const wholeBugs = Math.floor(this.resource.bugs.accumulator);
                this.collectResource("bugs", wholeBugs);
                this.resource.bugs.accumulator -= wholeBugs;
            }

            if(this.second >= 1000)
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