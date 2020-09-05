import {getUpdateAddress, deleteAddress,getAddressList,postAddress} from '../../api/address'
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
      provinceData: [],
      cityData: [],
      areaData: [],
    }
  },
  methods: {
    //设置默认地址
    updateAddress(addressId) {
      let data = {
        accessToken: localStorage.getItem('accessToken'),
        username: this.username,
        ifDefault: true,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }
      getUpdateAddress(this.addressId, data).then(res => {
          if (res.data.code === 1) {
            this.getAddressList()
          }
        }
      ).catch(error => {
        console.log(error.response)
      });
    },
    //删除地址
    deleteAddress(addressId) {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>您确定要删除该地址吗？</p>',
        onOk: () => {
          deleteAddress(params.row.addressId).then(res => {
            this.$Message.info(res.data.message);
            this.getAddressList()
          }).catch(error => {
            console.log(error.response)
          });
        }
      });
    }
    ,
    //选择省市区
    onSelected(data) {
      this.formValidate.province = data.province.value;
      this.formValidate.city = data.city.value;
      this.formValidate.area = data.area.value;
    }
    ,
    getAddressList() {
      let params = {}
      getAddressList(params).then(res => {
        this.tableData = res.data.content;
      }).catch(error => {
        console.log(error)
        this.$Message.warning(error.response.data.message)
      });

    }
    ,
    //获取省份
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
    }
    ,
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
    }
    ,
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
    }
    ,
    //获取地址详情
    getAddress() {
      getUpdateAddress(this.addressId,data).then(res=>{
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
    }
    ,
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
    }
    ,
    //提交地址
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.formValidate.province === "" || this.formValidate.province === "省") {
            return this.$Message.warning('请将省市区填写完整');
          }
          if (this.modalType === 0) {
            let data={
              accessToken: localStorage.getItem('accessToken'),
              username: this.username,
              name: this.formValidate.name,
              mobile: this.formValidate.phone,
              province: this.formValidate.province,
              city: this.formValidate.city,
              district: this.formValidate.area,
              addr: this.formValidate.addr,
              ifDefault: this.formValidate.interest,
              headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }
            getUpdateAddress(this.addressId,data).then(res=>{
              if (res.data.code === 1) {
                this.$Message.success('修改成功!');
                this.handleReset('formValidate')
                this.getAddressList()
              }
            }).catch(error => {
              console.log(error.response)
            });
          } else if (this.modalType === 1) {
            let params={
              username: this.username,
              name: this.formValidate.name,
              mobile: this.formValidate.phone,
              province: this.formValidate.province,
              city: this.formValidate.city,
              district: this.formValidate.area,
              addr: this.formValidate.addr,
              ifDefault: this.formValidate.interest,
              headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }
            postAddress(params).then(res=>{
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
    }
    ,
    handleReset(name) {
      this.showModal = false;
      this.formValidate.name = '';
      this.formValidate.phone = '';
      this.formValidate.addr = '';
      this.formValidate.interest = true;
      this.$refs[name].resetFields();
    }
    ,
  },
  //计算属性
  computed: {}
  ,
  created() {
    this.username = this.$route.query.username;
  }
  ,
  mounted() {
    this.getAddressList();
  }
  ,
  watch: {}
}
