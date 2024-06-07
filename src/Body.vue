<template>
  <div class="container" style="margin-top:80px;">
    <div class="row">
      <div class="col-6">
        <Bug/>
      </div>
      <div class="col-6">
        <Upgrades/>
      </div>
    </div>
        
    
  </div>
</template>

<script>
import Bug from './components/Bug.vue';
import Upgrades from './components/Upgrades.vue';

export default {
  components: {
    Bug,
    Upgrades
  },
  props: {
  },
  data() {
    return {

    }
  },
  methods: {
  }
}
</script>

<style scoped></style>