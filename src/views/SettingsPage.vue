<template>
  <div>
    <main-layout :idx="3">
      <el-container slot="container" class="hv100" style="background-color: #f0f2f5;">

      </el-container>
    </main-layout>

  </div>
</template>

<script>
  import MainLayout from "@/views/layout/MainLayout";
  export default {
    name: 'contacts-page',
    components: {
      MainLayout
    },
    data() {
      return {

      };
    },
    created() {

    },
    methods: {

    }
  };

</script>
<style scoped>


</style>
