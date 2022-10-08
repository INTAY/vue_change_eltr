<template>
  <div>
    <el-select :placeholder="placeholder"
               v-model="value"
               value-key="id"
               :size="size"
               clearable
               @input="change($event)">
      <el-option v-for="item in optionsList"
                 :key="item.value"
                 :label="item.name"
                 :value="item.value"
                 :disabled="item.disabled"/>
    </el-select>
  </div>
</template>

<script>
  export default {
    props: {
      placeholder: {
        default: '请选择',
        type: String
      },
      size: {
        default: 'mini',
        type: String
      },
      filterable: {
        default: false,
        type: Boolean
      },
      modelValue: {
        default: "",
        type: String
      },
      optionsList: {
        default: () => {
          return []
        },
        type: Array
      },
    },
    name: "selectVue",
    data() {
      return {
        options: [],
        value:"",
      }
    },
    methods: {
      change: function (val) {
        this.$emit('input', val)
      }
    }
  }
</script>

<style scoped>
</style>
