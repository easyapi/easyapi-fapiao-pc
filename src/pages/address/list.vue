<template>
  <div class="addressManage">
    <Breadcrumb separator="<b style='color:#333; margin-left:-8px'>/</b>">
      <img src="../../assets/images/logo.png" alt="" style="margin-right: 8px; width: 25px; height: 25px;">
      <BreadcrumbItem to="/" style="color: #333">发票管理</BreadcrumbItem>
      <BreadcrumbItem style="color: #333">邮寄地址管理</BreadcrumbItem>
    </Breadcrumb>
    <div class="set-content">
      <!-- <span style="color: #333333;font-size: 16px;display: block;height: 57px;line-height: 57px;">邮寄地址</span> -->
      <h3 class="h3-title">邮寄地址</h3>
      <Modal
        v-model="showModal"
        :title="modalTitle">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
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
        <div
          :class="{'selecting':addressId === addressData.addressId}"
          class="get-address"
          @click.stop="selectAddress(addressData.addressId)"
          style="float:left"
          v-for="addressData in tableData">
          <img
            v-if="addressId === addressData.addressId"
            src="../../assets/images/default.png"
            alt
            style="position: absolute;bottom:0px;right: 0px;"
          >
          <p class="userName">
            <span style="color: #515a6e;">{{addressData.name}}</span>
            <span v-if="addressData.ifDefault===false" style="color: #2d8cf0;"
                  @click="setDefault(addressData.addressId)">设为默认</span>
            <Button v-if="addressData.ifDefault == true" size="small" style="margin-left: 13px; margin-left:136px"
                    type="primary">默认
            </Button>
          </p>
          <p class="address-informations" style="margin-top:10px;">{{addressData.mobile}}</p>
          <p class="address-informations">{{addressData.province }}&nbsp;&nbsp;&nbsp;&nbsp;{{addressData.city}}</p>
          <p class="address-informations">{{addressData.district + addressData.addr}}</p>
          <div class="btn">
            <Button size="small" style="font-size: 14px" @click.stop="openDialog(0,addressData.addressId)">修改</Button>
            <Button size="small" style="font-size: 14px" @click.stop="deleteAddress(addressData.addressId)">删除
            </Button>
          </div>
        </div>
        <div class="add-the-address" @click="openDialog(1)">
          <img src="../../assets/images/plus.png" alt="" style="display: block;margin:52px auto;">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {
    updateAddress,
    getAddress,
    deleteAddress,
    getAddressList,
    putUpdateAddress,
    createAddress,
    getDefaultAddress
  } from '../../api/address'
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
        showModal: false,
        modalTitle: '添加地址',
        modalType: null,
        addressId: "",//保存地址id
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
        provinceData: [],
        cityData: [],
        areaData: [],
      }
    },
    methods: {
      getDefaultAddress() {
        getDefaultAddress().then(res => {
          if (res.data.code == 1) {
            this.addressId = res.data.content.addressId
          }
        })
      },
      selectAddress(addressId) {
        this.addressId = addressId
        updateAddress(addressId).then(res => {
            if (res.data.code === 1) {
              this.$Message.success("操作成功");
              this.getAddressList()
              this.$router.back(-1)
            }
          }
        ).catch(error => {
          this.$Message.error(error.response.data.message)
          console.log(error.response)
        });
      },
      /**
       * 设置默认地址
       */
      // setDefault(addressId) {
      //   console.log(addressId)
      //   updateAddress(addressId).then(res => {
      //       if (res.data.code === 1) {
      //         this.$Message.success("操作成功");
      //         this.getAddressList()
      //         this.$router.back(-1)
      //       }
      //     }
      //   ).catch(error => {
      //     this.$Message.error(error.response.data.message)
      //     console.log(error.response)
      //   });
      // },
      /**
       * 删除地址
       */
      deleteAddress(addressId) {
        this.$Modal.confirm({
          title: '提示',
          content: '<p>您确定要删除该地址吗？</p>',
          onOk: () => {
            deleteAddress(addressId).then(res => {
              this.$Message.info(res.data.message);
              this.getAddressList()
            }).catch(error => {
              console.log(error.response)
            });
          }
        });
      },
      /**
       * 选择省市区
       */
      onSelected(data) {
        this.formValidate.province = data.province.value;
        this.formValidate.city = data.city.value;
        this.formValidate.area = data.area.value;
      },
      getAddressList() {
        let params = {}
        getAddressList(params).then(res => {
          console.log(res)
          this.tableData = res.data.content;
        }).catch(error => {
          this.$Message.warning(error.response.data.message)
        });

      },
      /**
       * 获取省份
       */
      getProvince() {
        this.$ajax({
          method: 'GET',
          url: 'https://api2.easyapi.com/area/all.json',
          params: {
            accessToken: localStorage.getItem('accessToken')
          }
        }).then(res => {
          this.provinceData = res.data.provinces
        }).catch(error => {
          console.log(error.response)
        });
      },
      /**
       * 获取市
       */
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
      /**
       * 获取区域
       */
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
      /**
       * 获取地址详情
       */
      getAddress() {
        getAddress(this.addressId).then(res => {
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
      openDialog(t, id) {
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
      /**
       * 提交地址
       * @param name
       */
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (!valid) {
            return;
          }
          if (this.formValidate.province === "" || this.formValidate.province === "省") {
            return this.$Message.warning('请将省市区填写完整');
          }
          if (this.modalType === 0) {
            let data = {
              accessToken: localStorage.getItem('accessToken'),
              name: this.formValidate.name,
              mobile: this.formValidate.phone,
              province: this.formValidate.province,
              city: this.formValidate.city,
              district: this.formValidate.area,
              addr: this.formValidate.addr,
              ifDefault: this.formValidate.interest,
              headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            };
            putUpdateAddress(this.addressId, data).then(res => {
              if (res.data.code === 1) {
                this.$Message.success('修改成功');
                this.handleReset('formValidate')
                this.getAddressList()
              }
            }).catch(error => {
              console.log(error.response)
            });
          } else if (this.modalType === 1) {
            let data = {
              name: this.formValidate.name,
              mobile: this.formValidate.phone,
              province: this.formValidate.province,
              city: this.formValidate.city,
              district: this.formValidate.area,
              addr: this.formValidate.addr,
              ifDefault: this.formValidate.interest,
              headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }
            createAddress(data).then(res => {
              if (res.data.code === 1) {
                this.$Message.success('添加成功');
                this.handleReset('formValidate')
                this.getAddressList()
              }
            }).catch(error => {
              console.log(error.response)
            });
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
      }
    },
    mounted() {
      this.getAddressList();
      this.getDefaultAddress()
    }
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
  @import '../../assets/styles/invoice.styl'
  .set-title {
    padding-left: 10px;

    span {
      color: #2d8cf0;
      font-size: 18px;
      border-right: 2px solid #2d8cf0;
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
    height: 165px;
    border-radius: 4px;
    border: solid 1px #dddddd;
    padding: 10px;
    cursor: pointer;
    margin-right: 20px;
    margin-bottom: 20px;
    position: relative;
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
    color: #515a6e;
    width: 280px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis
  }

  .btn {
    line-height: 45px;
    height: 45px;
  }

  .btn button {
    font-size: 12px;
    color: #2d8cf0;
  }

  .btn button:nth-child(2) {
    margin-left: 10px;
  }

  .add-the-address {
    width: 305px;
    height: 165px;
    border-radius: 4px;
    border: solid 1px #dddddd;
    cursor: pointer;
    overflow: hidden;
  }

  .add-the-address:hover {
    box-shadow: 0px 2px 11px 0px rgba(0, 0, 0, 0.05);
  }

  .ivu-breadcrumb {
    padding: 0 0 20px;
    font-size: 20px;
    border-bottom: 1px solid #ddd;
    color: #666;
    font-weight: bold;
  }

  .distpicker-address-wrapper >>> select {
    width: 32.6% !important;
    font-size: 14px !important;
    padding-left: 3px !important;
  }

  .selecting {
    border: 1px solid #2d8cf0 !important;
    color: #2d8cf0;
  }

</style>

