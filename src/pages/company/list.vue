<template>
  <div class="Invoice-details">
    <Breadcrumb>
      <BreadcrumbItem to="/">发票管理</BreadcrumbItem>
      <BreadcrumbItem>发票抬头管理</BreadcrumbItem>
    </Breadcrumb>
    <div class="set-content">
      <div class="txt-right tbPading-20">
        <Button type="primary" @click="addInvoiceTitleFn(1)" class="btn" v-if="ifManageCompany">添加发票抬头</Button>
        <Modal
          v-model="showModal"
          :title="modalTitle">
          <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
            <FormItem label="公司名称" prop="name">
              <Input v-model="formValidate.name" placeholder="请输入发票抬头" @on-change="autocomplete"
                     :disabled="!ifManageCompany"/>
              <div class="query-results" v-if="this.queryTitleList!==''">
                <ul>
                  <li v-for="(result, index) in queryTitleList" :key="index" @click="chooseRise(index)">
                    {{result.name}}
                  </li>
                </ul>
              </div>
            </FormItem>
            <FormItem label="纳税人识别号" prop="taxNumber">
              <Input v-model="formValidate.taxNumber" placeholder="请输入纳税人识别号" :disabled="!ifManageCompany"/>
            </FormItem>
            <FormItem label="开户行" prop="bank">
              <Input v-model="formValidate.bank" placeholder="请输入开户行"/>
            </FormItem>
            <FormItem label="开户行账号" prop="bankAccount">
              <Input v-model="formValidate.bankAccount" placeholder="请输入开户行账号"/>
            </FormItem>
            <FormItem label="地址" prop="address">
              <Input v-model="formValidate.address" placeholder="请输入地址"/>
            </FormItem>
            <FormItem label="电话" prop="phone">
              <Input v-model="formValidate.phone" placeholder="请输入电话"/>
            </FormItem>
            <FormItem>
              <Checkbox v-model="ifDefault">设为默认</Checkbox>
            </FormItem>
          </Form>
          <div slot="footer">
            <Button type="primary" @click="handleSubmit('formValidate')" class="btn">确定</Button>
            <Button @click="handleReset('formValidate')" style="margin-left: 8px">取消</Button>
          </div>
        </Modal>
      </div>
      <Table border :stripe='true' :columns="tableColumns" :data="tableData"></Table>
      <p class="tpPading-10 btPading-10">注意：发票抬头最多可以添加5个</p>
      <div class="page-box flex-r">
        <Page :total='page.total' :page-size="page.size" :current="page.current" @on-change="changePage"
              show-elevator></Page>
      </div>
    </div>
  </div>
</template>
<script src="list.js"></script>
<style scoped lang="stylus">
  @import '../../assets/styles/invoice.styl'
  .set-title {
    padding-left: 10px;

    span {
      color: #18c1d6;
      font-size: 18px;
      border-right: 2px solid #18c1d6;
      padding: 10px 10px 10px 0;
      cursor: pointer;
    }

    img {
      margin-left: 10px;
    }
  }

  .Invoice-details {
    background-color: #fff;
    padding: 20px 40px;
  }

  .query-results {
    width: 100%;
    height: auto;
  }

  .query-results ul {
    border: 1px solid #e8eaec;
    border-top: none;
    padding-left: 10px;
  }

  .query-results ul li {
    cursor: pointer;
  }

  .btn {
    border: solid 1px #18c1d6;
    background-color: #18c1d6;
  }
  .ivu-breadcrumb{
    padding:20px 0px 14px;
    font-size:20px;
    border-bottom:1px solid #ddd;
    color: #666;
    font-weight: bold;
  }
</style>
