<template>
    <div>
        <el-container>
            <el-header>Header</el-header>
            <el-main>Main</el-main>
            <el-footer>Footer</el-footer>
        </el-container>
    </div>
</template>

<script>
    export default {
        name: "group-setup",
        props: {
            group_id: {
                type: Number,
                default: 0
            }
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
</style>