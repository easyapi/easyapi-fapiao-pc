<template>
  <Modal
    v-model="showModal"
    :title="modalTitle">
    <!--<Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">-->
      <!--<FormItem label="公司名称" prop="name">-->
        <!--<Input v-model="formValidate.name" placeholder="请输入发票抬头" @on-change="autocomplete"-->
               <!--:disabled="!ifManageCompany"/>-->
        <!--<div class="query-results" v-if="this.queryTitleList!==''"-->
             <!--style="position: absolute; z-index: 999; background: white; width: 368px">-->
          <!--<ul>-->
            <!--<li v-for="(result, index) in queryTitleList" :key="index" @click="chooseRise(index)">-->
              <!--{{result.name}}-->
            <!--</li>-->
          <!--</ul>-->
        <!--</div>-->
      <!--</FormItem>-->
      <!--<FormItem label="纳税人识别号" prop="taxNumber">-->
        <!--<Input v-model="formValidate.taxNumber" placeholder="请输入纳税人识别号" :disabled="!ifManageCompany"/>-->
      <!--</FormItem>-->
      <!--<FormItem label="开户行" prop="bank">-->
        <!--<Input v-model="formValidate.bank" placeholder="请输入开户行"/>-->
      <!--</FormItem>-->
      <!--<FormItem label="开户行账号" prop="bankAccount">-->
        <!--<Input v-model="formValidate.bankAccount" placeholder="请输入开户行账号"/>-->
      <!--</FormItem>-->
      <!--<FormItem label="地址" prop="address">-->
        <!--<Input v-model="formValidate.address" placeholder="请输入地址"/>-->
      <!--</FormItem>-->
      <!--<FormItem label="电话" prop="phone">-->
        <!--<Input v-model="formValidate.phone" placeholder="请输入电话"/>-->
      <!--</FormItem>-->
      <!--<FormItem>-->
        <!--<Checkbox v-model="ifDefault">设为默认</Checkbox>-->
      <!--</FormItem>-->
    <!--</Form>-->
    <div slot="footer">
      <Button type="primary" @click="handleSubmit('formValidate')">确定</Button>
      <Button @click="handleReset('formValidate')" style="margin-left: 8px">取消</Button>
    </div>
  </Modal>
</template>

<script>
    export default {
        name: "model"
    }
</script>

<style scoped>

</style>
