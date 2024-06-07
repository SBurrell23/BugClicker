<template>
  <div class="container" style="margin-top:80px;">
    <div class="row">
      <div class="col-8">
        <Bug ref="bug"/>
      </div>
      <div class="col-4">
        <Shop @buy="boughtUpgrade"/>
      </div>
    </div>
  </div>
</template>

<script>
import Bug from './components/Bug.vue';
import Shop from './components/Shop.vue';


export default {
  components: {
    Bug,
    Shop
  },
  props: {
  },
  data() {
    return {

    }
  },
  methods: {
    boughtUpgrade(id){
      this.$refs.bug.buyUpgrade(id);
    }
  }
}
</script>

<style scoped></style>