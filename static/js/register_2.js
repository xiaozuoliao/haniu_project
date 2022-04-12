var vm = new Vue({
    el: '#app',
    // 修改Vue变量的读取语法，避免和django模板语法冲突
    delimiters: ['[[', ']]'],
    data: {
        host: host,
        error_name: false,
        error_password: false,
        error_password2: false,
        error_check_password: false,
        error_mobile: false,
        error_image_code: false,
        error_sms_code: false,
        error_allow: false,
        error_name_message: '请输入5-20个字符的用户',
        error_password_message: '请输入8-20位的密码',
        error_password2_message: '两次输入的密码不一致',
        error_mobile_message: '请输入正确的手机号码',
        error_image_code_message: '请填写图形验证码',
        error_sms_code_message: '请填写短信验证码',
        error_allow_message: '请勾选用户协议',
        image_code_id: '',
        image_code_url: '',
        sms_code_tip: '获取短信验证码',
        sending_flag: false,
        username: '',
        password: '',
        password2: '',
        mobile: '',
        image_code: '',
        sms_code: '',
        allow: false,
    },
    mounted(){
        // 生成图形验证码
        this.generate_image_code();
    },
    methods: {
        generateUUID: function () {
            var d = new Date().getTime();
            if (window.performance && typeof window.performance.now === "function") {
                d += performance.now(); //use high-precision timer if available
            }
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
            return uuid;
        },
        // 生成一个图片验证码的编号，并设置页面中图片验证码img标签的src属性
        generate_image_code: function () {
            // 生成UUID。generateUUID() : 封装在common.js文件中，需要提前引入
            this.uuid = generateUUID();
            // 拼接图形验证码请求地址
            this.image_code_url = "/image_codes/" + this.uuid + "/";
        },
        // 检查用户名
        check_username: function () {
            var re = /^[a-zA-Z0-9_-]{5,20}$/;
            if (re.test(this.username)) {
                this.error_name = false;
                let url = '/usernames/' + this.username + '/count/';
                axios.get(url).then(response => {
                    if (response.status == '200') {
                        //    3.请求成功的回调的业务逻辑
                        console.log(response)
                        if (response.data.count == 0) {
                            this.error_name = false
                        } else {
                            this.error_name = true;
                            this.error_name_message = '用户名已注册';
                        }
                    }
                }).catch(error => {
                    alert('报错了，见日志')
                    console.error(response)
                })
            } else {
                this.error_name_message = '请输入5-20个字符的用户名';
                this.error_name = true;
            }

        },
        // 检查密码
        check_password: function () {
            var re = /^[a-zA-Z0-9_-]{5,20}$/;
            if (re.test(this.password)) {
                this.error_password = false;
            } else {
                this.error_password = true;
            }

        },
        // 确认密码
        check_password2: function () {
            if (this.password != this.password2) {
                this.error_password2 = true;
            } else {
                this.error_password2 = false;
            }
        },
        // 检查手机号
        check_mobile: function () {
            var re = /^1[345789]\d{9}$/;
            if (re.test(this.mobile)) {
                this.error_mobile = false;
            } else {
                this.error_mobile = true;
            }

        },
        // 检查图片验证码
        check_image_code: function () {


        },
        // 检查短信验证码
        check_sms_code: function () {

        },
        // 检查是否勾选协议 checkbox里v-model事件绑定的是checked的属性
        check_allow: function () {

            if (!this.allow) {
                this.error_allow = true;
            } else {
                this.error_allow = false;
            }
        },
        // 发送手机短信验证码
        send_sms_code: function () {

        },
        // 表单提交
        on_submit() {
            this.check_username()
            this.check_password()
            this.check_password2()
            this.check_mobile()
            this.check_allow()
            if (this.error_name == true || this.error_password == true || this.error_password2 == true
                || this.error_mobile == true || this.error_allow == true) {
                // 不满足注册条件：禁用表单
                window.event.returnValue = false;
            }

        }
    }
});





