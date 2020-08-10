<template>
  <div></div>
</template>

<script>
export default {
  name: 'FilePicker',

  mounted() {
    this.$client.files
      .list('/')
      .then(res => console.log(res))
      .catch(error => console.error(error))
  }
}
</script>
