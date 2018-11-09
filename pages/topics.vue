<template lang="pug">
  .topicsWrap
    Topics

</template>

<script>
  import Topics from '~/components/topics/Topics'

  export default {
    head: {
      title: 'Topics',
      link: [{
        hid: "canonical",
        rel: "canonical",
        href: "/start"
      }],
      meta: [
        { hid: 'description', name: 'description', content: 'Sentiment analysis from social media' },
        { hid: 'og:description', name: 'og:description', content: 'Sentiment analysis from social media' },
        { hid: 'og:title', name: 'og:title', content: 'Topics Management' },
      ]
    },
    data() {
      return {

      }
    },
    components: {
      Topics
    },
    beforeCreate() {
      this.$store.commit('setPageHead', 'Topics');
    }
  }
</script>

<style scoped lang="scss">

</style>
