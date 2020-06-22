<template>
  <div class="addressManage">
    <h2 class="set-title">
      <span @click="()=>{this.$router.go(-1)}"><Icon type="ios-arrow-back"/>返回</span>
      <img src="../assets/images/logo.png" alt="" style="margin-right: 10px;">发票地址管理
    </h2>
    <div class="set-content">
      <span style="color: #333333;font-size: 16px;display: block;height: 57px;line-height: 57px;">邮寄地址</span>
      <Modal
        v-model="showModal"
        :title="modalTitle">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="90">
          <FormItem label="收件人姓名" prop="name">
            <Input v-model="formValidate.name" placeholder="请输入收件人姓名"></Input>
          </FormItem>
          <FormItem label="收件人手机" prop="phone">
            <Input v-model="formValidate.phone" placeholder="请输入收件人手机号"></Input>
          </FormItem>
          <FormItem label="所在省市区">
            <v-distpicker :province="formValidate.province" :city="formValidate.city" :area="formValidate.area"
                          @selected="onSelected"></v-distpicker>
          </FormItem>
          <FormItem label="详细地址">
            <Input v-model="formValidate.addr" placeholder="请输入详细地址"></Input>
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
               @click.stop="updateAddress(addressData.invoiceAddressId)">
            <p class="userName"><span>{{addressData.name}}</span>
              <span v-if="addressData.ifDefault===false" style="color: #18c1d6;">设为默认</span>
            </p>
            <p class="address-informations" style="margin-top:10px;">{{addressData.mobile}}</p>
            <p class="address-informations">{{addressData.province }}&nbsp;&nbsp;&nbsp;&nbsp;{{addressData.city}}</p>
            <p class="address-informations">{{addressData.district + addressData.addr}}</p>
            <div class="btn">
              <Button @click.stop="addAddressFn(0,addressData.invoiceAddressId)">修改</Button>
              <Button @click.stop="DeleteAddress(addressData.invoiceAddressId)">删除</Button>
            </div>
          </div>
          <div class="get-address" style="border: solid 1px #1cc1d6;position: relative"
               v-if="addressData.ifDefault===true" @click.stop="updateAddress(addressData.invoiceAddressId)">
            <p class="userName"><span>{{addressData.name}}</span>
              <span
                style="width: 40px;height: 18px;background-color: #18c1d6;border-radius: 2px; color: #fff;margin-top:8px;line-height:18px;font-size: 12px;text-align: center">默认</span>
            </p>
            <p class="address-informations" style="margin-top:10px;">{{addressData.mobile}}</p>
            <p class="address-informations">{{addressData.province }}&nbsp;&nbsp;&nbsp;&nbsp;{{addressData.city}}</p>
            <p class="address-informations">{{addressData.district + addressData.addr}}</p>
            <div class="btn">
              <Button @click.stop="addAddressFn(0,addressData.invoiceAddressId)">修改</Button>
              <Button @click.stop="DeleteAddress(addressData.invoiceAddressId)">删除</Button>
            </div>
            <img src="../assets/images/default.png" alt="" style="position: absolute;bottom:0px;right: 0px;">
          </div>
        </div>
        <div class="add-the-address" @click="addAddressFn(1)">
          <img src="../assets/images/plus.png" alt="" style="display: block;margin:61px auto;">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {addressesUrl, addrUrl} from '../api/api';
  import VDistpicker from 'v-distpicker'

  export default {
    name: '',
    components: {
      VDistpicker,
    },
    data() {
      const phoneCodeVerify = (rule, value, callback) => {
        if (/^[0-9]{11}$/.test(value) === false) {
          return callback(new Error('请输入正确格式的11位手机号码'));
        }
        callback();
      };
      return {
        username: '',
        showModal: false,
        modalTitle: '添加地址',
        modalType: null,
        addressId: '',//保存地址id
        formValidate: {
          name: "",
          phone: "",
          province: '',
          city: '',
          area: '',
          addr: '',
          interest: true,
        },
        ruleValidate: {
          name: [
            {required: true, message: '请输入收件人姓名', trigger: 'blur'}
          ],
          phone: [
            {required: true, message: '请输入正确的手机号码', trigger: 'blur'},
            {validator: phoneCodeVerify, trigger: 'blur'}
          ],
          province: [
            {required: true, message: '请选择省份', trigger: 'change'}
          ],
          city: [
            {required: true, message: '请选择城市', trigger: 'change'}
          ],
          area: [
            {required: true, message: '请选择地区', trigger: 'change'}
          ],
        },
        tableData: [],
        provincData: [],
        cityData: [],
        areaData: [],
      }
    },
    methods: {
      //设置默认地址
      updateAddress(invoiceAddressId) {
        console.log(invoiceAddressId)
        this.$ajax.put(addrUrl + '/' + invoiceAddressId, {
          params: {
            accessToken: localStorage.getItem('accessToken'),
            username: this.username,
            ifDefault: true
          },
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(res => {
          if (res.data.code === 1) {
            this.getAddressList()
          }
        }).catch(error => {
          console.log(error.response)
        });
      },
      //删除地址
      DeleteAddress(invoiceAddressId) {
        this.$Modal.confirm({
          title: '提示',
          content: '<p>您确定要删除该地址吗？</p>',
          onOk: () => {
            this.$ajax.delete(addrUrl + '/' + invoiceAddressId, {
              params: {
                accessToken: localStorage.getItem('accessToken')
              }
            }).then(res => {
              this.$Message.info('删除成功');
              this.getAddressList()
            }).catch(error => {
              console.log(error.response)
            });
          }
        });
      },
      //选择省市区
      onSelected(data) {
        this.formValidate.province = data.province.value;
        this.formValidate.city = data.city.value;
        this.formValidate.area = data.area.value;
      },
      getAddressList() {
        this.$ajax.get(addressesUrl, {
          params: {
            accessToken: localStorage.getItem('accessToken'),
            username: this.username,
          }
        }).then(res => {
          this.tableData = res.data.content;
        }).catch(error => {
          console.log(error)
          this.$Message.warning(error.response.data.message)
        });

      },
      //获取省份
      getProvince() {
        this.$ajax({
          method: 'GET',
          url: 'https://api2.easyapi.com/area/all.json',
          params: {
            accessToken: localStorage.getItem('accessToken')
          }
        }).then(res => {
          this.provincData = res.data.provinces
        }).catch(error => {
          console.log(error.response)
        });
      },
      //获取市
      getCity() {
        this.$ajax.get('https://api2.easyapi.com/area/' + this.formValidate.province + '/cities.json', {
          params: {
            accessToken: localStorage.getItem('accessToken')
          }
        }).then(res => {
          this.cityData = res.data.cities
        }).catch(error => {
          console.log(error.response)
        });
      },
      //获取区域
      getArea() {
        this.$ajax.get('https://api2.easyapi.com/area/' + this.formValidate.city + '/districts.json', {
          params: {
            accessToken: localStorage.getItem('accessToken')
          }
        }).then(res => {
          this.areaData = res.data.districts
          this.formValidate.area = this.areaData[0].name;
        }).catch(error => {
          console.log(error.response)
        });
      },
      //获取地址详情
      getAddress() {
        this.$ajax.get(addrUrl + '/' + this.addressId, {
          params: {
            accessToken: localStorage.getItem('accessToken')
          }
        }).then(res => {
          let data = res.data.content;
          this.formValidate.name = data.name;
          this.formValidate.phone = data.mobile;
          this.formValidate.province = data.province;
          this.formValidate.city = data.city;
          this.formValidate.area = data.district;
          this.formValidate.addr = data.addr;
          this.formValidate.interest = data.ifDefault;
        }).catch(error => {
          console.log(error.response)
        });
      },
      addAddressFn(t, id) {
        this.modalType = t;
        if (t === 0) {
          this.addressId = id;
          this.modalTitle = "编辑地址";
          this.showModal = true;
          this.getAddress()
        } else if (t === 1) {
          this.formValidate.province = '';
          this.formValidate.city = '';
          this.formValidate.area = '';
          this.modalTitle = "添加地址";
          this.showModal = true;
        }
      },
      //提交地址
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            if (this.formValidate.province === "" || this.formValidate.province === "省") {
              return this.$Message.warning('请将省市区填写完整');
            }
            if (this.modalType === 0) {
              this.$ajax.put(addrUrl + "/" + this.addressId, {
                params: {
                  accessToken: localStorage.getItem('accessToken'),
                  username: this.username,
                  name: this.formValidate.name,
                  mobile: this.formValidate.phone,
                  province: this.formValidate.province,
                  city: this.formValidate.city,
                  district: this.formValidate.area,
                  addr: this.formValidate.addr,
                  ifDefault: this.formValidate.interest,
                },
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
              }).then(res => {
                if (res.data.code === 1) {
                  this.$Message.success('修改成功!');
                  this.handleReset('formValidate')
                  this.getAddressList()
                }
              }).catch(error => {
                console.log(error.response)
              });
            } else if (this.modalType === 1) {
              this.$ajax.post(addrUrl, {
                params: {
                  accessToken: localStorage.getItem('accessToken'),
                  username: this.username,
                  name: this.formValidate.name,
                  mobile: this.formValidate.phone,
                  province: this.formValidate.province,
                  city: this.formValidate.city,
                  district: this.formValidate.area,
                  addr: this.formValidate.addr,
                  ifDefault: this.formValidate.interest,
                },
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
              }).then(res => {
                if (res.data.code === 1) {
                  this.$Message.success('添加成功!');
                  this.handleReset('formValidate')
                  this.getAddressList()
                }
              }).catch(error => {
                console.log(error.response)
              });
            }
          } else {
            this.$Message.error('请将信息填写完整!');
          }
        })
      },
      handleReset(name) {
        this.showModal = false;
        this.formValidate.name = '';
        this.formValidate.phone = '';
        this.formValidate.addr = '';
        this.formValidate.interest = true;
        this.$refs[name].resetFields();
      },
    },
    //计算属性
    computed: {},
    created() {
      this.username = this.$route.query.username;
    },
    mounted() {
      this.getAddressList();
    },
    watch: {}
  }
</script>
<style lang="stylus">
  .distpicker-address-wrapper select {
    height: 32px !important;
    line-height: 1.5 !important;
    font-size: 12px !important;
    padding: 4px 7px !important;
  }
</style>
<style scoped lang="stylus">
  @import '../assets/styles/invoice.styl'
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
    height: auto;
    background-color: #ffffff;
    border: solid 1px #dddddd;
  }

  .set-content {
    margin: 0px 38px;
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
</style>

