<template>
  <div>
    <main-layout :idx="3">
      <el-container slot="container" class="hv100">
        <!-- 左侧侧边栏 -->
        <el-aside width="300px" class="aside-box padding0">
          <el-container class="vh100">
            <el-header height="60px" class="padding0" style="background-color: turquoise;"></el-header>
            <el-header min-height="60px" class="padding0" style="background-color: red;">
              <div style="height: 200px;width: 100%;"></div>
            </el-header>
            <el-main class="padding0">

            </el-main>
          </el-container>
        </el-aside>

        <el-main>

        </el-main>
      </el-container>
    </main-layout>
  </div>
</template>

<script>
  import MainLayout from "@/views/layout/MainLayout";
  export default {
    name: 'schedule-page',
    components: {
      MainLayout
    },
    data() {
      return {

      };
    },
    methods: {

    }
  };

</script>
<style scoped>
  .aside-box {
    position: relative;
    background-color: white;
    overflow: hidden;
  }

</style>
