<template>
  <div class="addressManage">
    <Breadcrumb>
      <BreadcrumbItem to="/">发票管理</BreadcrumbItem>
      <BreadcrumbItem>发票抬头管理</BreadcrumbItem>
    </Breadcrumb>
    <div class="set-content">
      <span style="color: #333333;font-size: 16px;display: block;height: 57px;line-height: 57px;">邮寄地址</span>
      <Modal
        v-model="showModal"
        :title="modalTitle">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="90">
          <FormItem label="收件人姓名" prop="name">
            <Input v-model="formValidate.name" placeholder="请输入收件人姓名"/>
          </FormItem>
          <FormItem label="收件人手机" prop="phone">
            <Input v-model="formValidate.phone" placeholder="请输入收件人手机号"/>
          </FormItem>
          <FormItem label="所在省市区">
            <v-distpicker :province="formValidate.province" :city="formValidate.city" :area="formValidate.area"
                          @selected="onSelected"></v-distpicker>
          </FormItem>
          <FormItem label="详细地址">
            <Input v-model="formValidate.addr" placeholder="请输入详细地址"/>
          </FormItem>
          <FormItem>
            <Checkbox v-model="formValidate.interest">设为默认</Checkbox>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="primary" @click="handleSubmit('formValidate')">确定</Button>
          <Button @click="handleReset('formValidate')" style="margin-left: 8px">取消</Button>
        </div>
      </Modal>
      <div class="address">
        <div style="float:left" v-for="addressData in tableData">
          <div class="get-address" v-if="addressData.ifDefault===false"
               @click.stop="updateAddress(addressData.addressId)">
            <p class="userName"><span>{{addressData.name}}</span>
              <span v-if="addressData.ifDefault===false" style="color: #18c1d6;">设为默认</span>
            </p>
            <p class="address-informations" style="margin-top:10px;">{{addressData.mobile}}</p>
            <p class="address-informations">{{addressData.province }}&nbsp;&nbsp;&nbsp;&nbsp;{{addressData.city}}</p>
            <p class="address-informations">{{addressData.district + addressData.addr}}</p>
            <div class="btn">
              <Button @click.stop="openDialog(0,addressData.addressId)">修改</Button>
              <Button @click.stop="deleteAddress(addressData.addressId)">删除</Button>
            </div>
          </div>
          <div class="get-address" style="border: solid 1px #1cc1d6;position: relative"
               v-if="addressData.ifDefault===true" @click.stop="updateAddress(addressData.addressId)">
            <p class="userName"><span>{{addressData.name}}</span>
              <span
                style="width: 40px;height: 18px;background-color: #18c1d6;border-radius: 2px; color: #fff;margin-top:8px;line-height:18px;font-size: 12px;text-align: center">默认</span>
            </p>
            <p class="address-informations" style="margin-top:10px;">{{addressData.mobile}}</p>
            <p class="address-informations">{{addressData.province }}&nbsp;&nbsp;&nbsp;&nbsp;{{addressData.city}}</p>
            <p class="address-informations">{{addressData.district + addressData.addr}}</p>
            <div class="btn">
              <Button @click.stop="openDialog(0,addressData.addressId)">修改</Button>
              <Button @click.stop="deleteAddress(addressData.addressId)">删除</Button>
            </div>
            <img src="../../assets/images/default.png" alt="" style="position: absolute;bottom:0px;right: 0px;">
          </div>
        </div>
        <div class="add-the-address" @click="openDialog(1)">
          <img src="../../assets/images/plus.png" alt="" style="display: block;margin:61px auto;">
        </div>
      </div>
    </div>
  </div>
</template>
<script src="list.js"></script>
<style lang="stylus">
  .distpicker-address-wrapper select {
    height: 32px !important;
    line-height: 1.5 !important;
    font-size: 12px !important;
    padding: 4px 7px !important;
  }
</style>
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
</style>
<style scoped>
  .addressManage {
    padding: 20px 40px;
    height: auto;
    background-color: #ffffff;
    border: solid 1px #dddddd;
  }

  .address {
    width: 100%;
    height: auto;
    margin-bottom: 20px;
  }

  .get-address {
    width: 305px;
    height: 182px;
    border-radius: 4px;
    border: solid 1px #dddddd;
    padding: 10px;
    cursor: pointer;
    margin-right: 20px;
    margin-bottom: 20px;
  }

  .get-address:hover {
    border: 1px solid #18c1d6;
  }

  .get-address .userName {
    height: 37px;
    line-height: 37px;
    border-bottom: solid 1px #dddddd;
    font-size: 14px;
    color: #333333;
    display: flex;
    justify-content: space-between;
  }

  .get-address .address-informations {
    font-size: 14px;
    color: #333333;
  }

  .btn {
    line-height: 45px;
    height: 45px;
  }

  .btn button {
    font-size: 12px;
    color: #18c1d6;
  }

  .btn button:nth-child(2) {
    margin-left: 10px;
  }

  .add-the-address {
    width: 305px;
    height: 182px;
    border-radius: 4px;
    border: solid 1px #dddddd;
    cursor: pointer;
    overflow: hidden;
  }

  .add-the-address:hover {
    box-shadow: 0px 2px 11px 0px rgba(0, 0, 0, 0.05);
  }

  .ivu-breadcrumb {
    padding: 20px 0px 14px;
    font-size: 20px;
    border-bottom: 1px solid #ddd;
    color: #666;
    font-weight: bold;
  }
</style>

