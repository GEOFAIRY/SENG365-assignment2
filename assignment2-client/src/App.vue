<template>
  <div id="app">
      <router-view></router-view>
      <Login></Login>
  </div>
</template>

<script>
import Login from './Login'
export default {
  name: 'app',
  components: {
    'Login': Login
  }
}
</script>
