<template>
  <Navbar />
  <Body />
</template>

<script>
import Navbar from './Navbar.vue';
import Body from './Body.vue';

export default {
  components: {
    Navbar,
    Body
  },
  data() {
    return {
    }
  }
}
</script>

<style>
.greeting {
  font-size: 2em;
  text-align: center;
}
</style>