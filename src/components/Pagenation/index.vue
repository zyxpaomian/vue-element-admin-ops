<template>
  <div class="pagenation">
    <el-pagination small  class="text-center"  @size-change="handleSizeChange" @current-change="handleCurrentChange":current-page="page.page" :page-sizes="pageSizes" :page-size="page.limit"
    layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
   </div>
</template>

<script>
export default {
  props: {
    total: {
      type: Number
    } // 总条数
  },
  data() {
    return {
      pageSizes: [10, 20, 50, 100],
      page: {
        page_index: 1,
        page_limit: 10
      }
    };
  },
  methods: {
    // // 每页查看条数变化
    handleSizeChange(val) {
      this.page.page_limit= val;
      this.$emit('pageChange', this.page);
    },
    // 当前页码变化
    handleCurrentChange(val) {
      this.page.page_index= val;
      this.$emit('pageChange', this.page);
    }
  },

}
</script>

<style scoped>
  .pagenation{
    margin: 20px 0;
  }
</style>