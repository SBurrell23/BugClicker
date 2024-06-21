<template>
    <div>
        <div class="row">

            <div class="col-12" v-for="index in [1,2,3,4,5]">
                <div class="card mb-2">
                    <div class="card-body" >
                        <h5 class="card-title">Incubator #{{ index }}</h5>
                        <div class="row">
                            <div class="col-md-4">
                                EGG
                            </div>
                            <div class="col-md-8">
                                <button class="btn btn-outline-success btn-sm" style="float:right" @click="hatch()">
                                    <i className="fa fa-circle-play"></i>&nbsp;Start Hatching
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        <!--

        Hatchery Ideas

        Hatchery's allow you to use eggs to hatch either:
        * a free collector upgrade (shitty)
        * a brand new collector type (way better)
        -- brand new collectors will pick from a list of 25 random bugs not used elsewhere in the game (just for the name)
        -- the collector will have random stats (rate,productType,cost)
        -- the number/cost of each productType will be between 1-5
        -- Early game you can only get new collectors with 1 or 2 resources
        -- later game you can hatch with more resources but it takes a long time
        -->
    </div>
</template>

<script>
export default {
    components: {
    },
    props: {
    },
    computed: {
    },
    data() {
        return {

        }
    },
    methods: {
    },
    mounted() {
    },
    unmounted() {
    }
}
</script>

<style scoped>
</style>