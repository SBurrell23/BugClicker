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
                <h4 class="mt-4">Money: ${{ money.toFixed(2) }}</h4>
                <button class="btn btn-danger me-2 mb-5" :disabled="bugs<1" @click="sellBug()">
                    Sell Bug ${{bugSalePrice.toFixed(2)}}
                </button>
            </div>
            <div class="col-6 centerText">
                <h4 class="mb-2 mt-4">Food: {{food}} / {{foodBagMax}}</h4>
                <button class="btn btn-success" :disabled="money<foodCost || (food + foodBuyAmount) > foodBagMax" @click="buyFood()">
                    Buy Food ${{foodCost}} for {{foodBuyAmount}}
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
                        <p class="card-text">Buying {{bps}} bug every second</p>
                    </div>
                </div>
            </div>

        </div>

    </div>

    </div>
</template>

<script>
import { resolveTypeElements } from 'vue/compiler-sfc';

export default {
    components: {
    },
    props: {
    },
    data() {
        return {
            interval: null,
            bugs:0,
            money:0.00,
            food:10,
            foodBagMax:50,
            bugFoodCost:1,
            bugSalePrice:1.50,
            foodCost:10.00,
            foodBuyAmount:10,
            bps:0
        }
    },
    methods: {
        collectBug(num){
            if(this.food >= this.bugFoodCost*num){
                this.bugs += num;
                this.food -= (this.bugFoodCost * num);
            }
            else
                this.collectBug(Math.floor(this.food / this.bugFoodCost));
        },
        buyBug(){
            this.bugs += 1;
            this.money -= 1;
        },
        sellBug(){
            this.bugs -= 1
            this.money += this.bugSalePrice
        },
        buyFood(){
            this.food += 10
            this.money -= this.foodCost;
        },
        buyUpgrade(item) {
            console.log(item);
            if(item == "autoBugBuyer"){
                this.bps += 1;
            }
        }
    },
    created() {
        this.interval = setInterval(() => {
            this.collectBug(this.bps);
        }, 1000);
    },
    destroyed() {
        clearInterval(this.interval);
    },
}
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