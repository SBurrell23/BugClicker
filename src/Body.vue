<template>
  <div class="container" style="margin-top:80px;">
    <Bug ref="bug"/>
  </div>
</template>

<script>
import Bug from './components/Bug.vue';

export default {
  components: {
    Bug
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