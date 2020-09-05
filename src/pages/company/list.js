import {queryServiceURl} from '../../api/api'
import {
  getCompanyList,
  getCompany,
  createCompany,
  updateCompany,
  updateDefaultCompany,
  deleteCompany
} from '../../api/company'

export default {
  name: '',
  components: {},
  data() {
    return {
      username: '',
      showModal: false,
      modalTitle: '添加发票',
      modalType: null,
      queryTitleList: '',
      companyId: '',//保存发票抬头ID
      ifManageCompany: true,//是否可以管理公司抬头
      message: '',
      code: '',
      formValidate: {
        name: '',
        taxNumber: '',
        bank: '',
        bankAccount: '',
        address: '',
        phone: '',
      },
      ifDefault: true,
      disabled: false,
      ruleValidate: {
        name: [
          {required: true, message: '请输入发票抬头', trigger: 'blur'}
        ],
        taxNumber: [
          {required: true, message: '请输入纳税人识别号', trigger: 'blur'},
        ],
        bank: [
          {required: true, message: '请输入开户行', trigger: 'blur'}
        ],
        bankAccount: [
          {required: true, message: '请输入开户行账号', trigger: 'blur'}
        ],
        address: [
          {required: true, message: '请输入注册地址', trigger: 'blur'}
        ],
        phone: [
          {required: true, message: '请输入注册电话', trigger: 'blur'}
        ],
      },
      tableColumns: [
        {
          title: '公司名称',
          key: 'name',
          align: 'center',
          width: 200
        },
        {
          title: '纳税人识别号',
          key: 'taxNumber',
          align: 'center'
        },
        {
          title: '开户行',
          key: 'bank',
          align: 'center'
        },
        {
          title: '开户行账号',
          key: 'bankAccount',
          align: 'center'
        },

        {
          title: '地址',
          key: 'address',
          align: 'center'
        },
        {
          title: '电话',
          key: 'phone',
          align: 'center'
        },
        {
          title: '操作',
          align: 'center',
          width: 200,
          render: (h, params) => {
            let showDisplay = "none";
            if (params.row.ifDefault) {
              showDisplay = 'none'
            } else {
              showDisplay = "inline-block";
            }
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px',
                  display: showDisplay
                },
                on: {
                  click: () => {
                    updateDefaultCompany(params.row.companyId).then(res => {
                      if (res.data.code === 1) {
                        this.$Message.success('操作成功!');
                        this.getCompanyList()
                      }
                    }).catch(error => {
                      console.log(error.response)
                    });
                  }
                }
              }, '设为默认'),
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px',
                  background: '#18c1d6',
                  border: 'solid 1px #18c1d6',
                },
                on: {
                  click: () => {
                    this.addInvoiceTitleFn(0, params.row.companyId)
                  }
                }
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                style: {
                  marginRight: '5px',
                  display: this.ifManageCompany != false ? 'inline-block' : 'none'
                },
                on: {
                  click: () => {
                    this.$Modal.confirm({
                      title: '提示',
                      content: '<p>您确定要删除该条记录吗？</p>',
                      onOk: () => {
                        deleteCompany(params.row.companyId).then(res => {
                          this.$Message.info('删除成功');
                          this.getCompanyList()
                        }).catch(error => {
                          console.log(error.response)
                        });
                      }
                    });
                  }
                }
              }, '删除'),
            ]);
          }
        }
      ],
      tableData: [],
      page: {
        current: 1,
        size: 5,
        total: 0,
      }
    }
  },
  methods: {
    //自动补齐
    autocomplete() {
      if (this.formValidate.name.length < 4) {
        return;
      }
      this.$ajax.get(queryServiceURl, {
        params: {
          accessToken: localStorage.getItem('accessToken'),
          name: this.formValidate.name
        }
      }).then(res => {
        this.code = res.data.code;
        if (res.data.code !== 0) {
          this.message = '',
            this.queryTitleList = res.data.content
        } else {
          this.message = res.data.message
        }
      }).catch(error => {
        console.log(error)
        this.$Notice.error({
          title: error.response.data.message,
          desc: error ? '' : 'Here is the notification description. Here is the notification description. '
        });
      });
    },
    chooseRise(index) {
      this.formValidate.name = this.queryTitleList[index].name;
      this.formValidate.taxNumber = this.queryTitleList[index].taxNumber;
      this.formValidate.bank = this.queryTitleList[index].bank;
      this.formValidate.bankAccount = this.queryTitleList[index].bankAccount;
      this.formValidate.address = this.queryTitleList[index].address;
      this.formValidate.phone = this.queryTitleList[index].phone;
      this.queryTitleList = [];
    },
    //获取抬头列表
    getCompanyList() {
      let params = {
        username: this.username,
        page: this.page.current - 1,
        size: this.page.size,
      }
      getCompanyList(params).then(res => {
        if (res.data.code === 0) {
          this.tableData = [];
          this.page.total = 0;
        } else {
          this.tableData = res.data.content;
          this.page.total = Number(res.data.totalElements);
        }
      }).catch(error => {
        console.log(error)
        this.$Message.warning(error.response.data.message)
      });
    },
    getCompany() {
      getCompany(this.companyId).then(res => {
        let data = res.data.content;
        this.formValidate.name = data.name;
        this.formValidate.taxNumber = data.taxNumber;
        this.formValidate.bank = data.bank;
        this.formValidate.bankAccount = data.bankAccount;
        this.formValidate.address = data.address;
        this.formValidate.phone = data.phone;
        this.ifDefault = data.ifDefault;
      }).catch(error => {
        console.log(error.response)
      });
    },
    getIfManageCompany() {
      this.$ajax.get('https://fapiao-api.easyapi.com/shop/0/setting?field=ifManageCompany', {
        params: {
          accessToken: localStorage.getItem('accessToken')
        }
      }).then(res => {
        if (res.data.code == '1' && res.data.content) {
          for (let setting of res.data.content) {
            if (setting.field === 'ifManageCompany') {
              this.ifManageCompany = setting.value;
            }
          }
        }
      }).catch(error => {
        console.log(error.response)
      });
    },
    //添加或编辑发票抬头
    addInvoiceTitleFn(t, id) {
      this.modalType = t;
      if (t === 0) {
        this.companyId = id;
        this.modalTitle = "编辑发票";
        this.showModal = true;
        this.getCompany();
      } else if (t === 1) {
        if (this.tableData.length < 5) {
          this.modalTitle = "添加发票";
          this.showModal = true;
        } else if (this.tableData.length === 5) {
          this.$Message.warning("发票最多只能添加5个")
        }
      }
    },
    //提交地址
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.modalType === 0) {
            let data = {}
            data.accessToken = localStorage.getItem('accessToken');
            data.name = this.formValidate.name;
            data.taxNumber = this.formValidate.taxNumber;
            data.bank = this.formValidate.bank;
            data.bankAccount = this.formValidate.bankAccount;
            data.address = this.formValidate.address;
            data.phone = this.formValidate.phone;
            data.ifDefault = this.ifDefault;
            data.username = this.username;
            updateCompany(this.companyId, data).then(res => {
              if (res.data.code === 1) {
                this.$Message.success('编辑成功!');
                this.handleReset('formValidate')
                this.getCompanyList();
              }
            }).catch(error => {
              console.log(error.response)
            });
          } else if (this.modalType === 1) {
            let data = {}
            data.accessToken = localStorage.getItem('accessToken');
            data.name = this.formValidate.name;
            data.taxNumber = this.formValidate.taxNumber;
            data.bank = this.formValidate.bank;
            data.bankAccount = this.formValidate.bankAccount;
            data.address = this.formValidate.address;
            data.phone = this.formValidate.phone;
            data.ifDefault = this.ifDefault;
            data.username = this.username;
            createCompany(data).then(res => {
              if (res.data.code === 1) {
                this.$Message.success('添加成功!');
                this.handleReset('formValidate')
                this.getCompanyList();
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
      this.ifDefault = true;
      this.$refs[name].resetFields();
    },
    //分页
    changePage(current) {
      this.page.current = current;
      this.getCompanyList()
    },
  },
  //计算属性
  computed: {},
  created() {
    this.username = this.$route.query.username;
  },
  mounted() {
    this.getIfManageCompany()
    this.getCompanyList()
  },
  watch: {}
}
