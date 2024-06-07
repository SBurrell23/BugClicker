<template>
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
                        <p class="card-text">Buying</p>
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
    },
    data() {
        return {
            interval: null,
            items: {
                "autoBugBuyer":{
                    level: 1,
                    bps: 1,
                    cost: 100,
                    costType: "money",
                    owned: false
                }
            }
        }
    },
    methods: {
        buyUpgrade(item) {
            if(item == "autoBugBuyer"){
                this.items.autoBugBuyer.owned = true;
            }
        },
    },
    onMounted() {

        this.intervalsetInterval(() => {
            if(this.items.autoBugBuyer.owned){
                
            }
        }, 1000);
    },
    onBeforeUnmount() {
        //clear the interval when the component is unmounted
        clearInterval(this.interval);
    },

}
</script>

<style scoped></style>