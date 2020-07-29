<template>
  <div
    style="position: fixed;height: 100%;width: 100%;display: flex;justify-content: center;align-items: center;background-color: #cccccc;">
    <div style="height: 500px;">
      <!-- <editor-emoticon></editor-emoticon> -->

      <editor style="width: 800px;height: 160px;margin: 0 auto;box-shadow: rgb(204, 204, 204) 0px -1px 20px;">
      </editor>
    </div>


  </div>
</template>

<script>
  import Editor from "@/components/editor/Editor";
  import EditorEmoticon from "@/components/editor/EditorEmoticon";
  export default {
    name: 'test-page',
    components: {
      Editor,
      EditorEmoticon
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
