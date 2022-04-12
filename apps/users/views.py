import logging
import re
from django import http
from django.contrib.auth import login
from django.db import DatabaseError
from django.shortcuts import render, redirect
# Create your views here.
from django.urls import reverse
from django.views import View

from apps.users.models import User

logger = logging.getLogger('django')
class RegisterView(View):
    """用户注册"""

    def get(self, request):
        """
        提供注册界面
        :param request: 请求对象
        :return: 注册界面
        """
        return render(request, 'register.html')

    def post(self, request):
        username = request.POST.get('username')
        password = request.POST.get('password')
        password2 = request.POST.get('password2')
        mobile = request.POST.get('mobile')
        allow = request.POST.get('allow')
        logger.info(request.POST)
    # 判断参数是否为空
        if not all([username, password, password2, mobile, allow]):
            return http.HttpResponseBadRequest('缺少必传参数')
        else:
            # 判断用户名是否是5-20个字符
            if not re.match(r'^[a-zA-Z0-9_]{5,20}$', username):
                return http.HttpResponseBadRequest('请输入5-20个字符的用户名')
            # 判断密码是否是8-20个数字
            if not re.match(r'^[0-9A-Za-z]{8,20}$', password):
                return http.HttpResponseBadRequest('请输入8-20位的密码')
            # 判断两次密码是否一致
            if password != password2:
                return http.HttpResponseBadRequest('两次输入的密码不一致')
            # 判断手机号是否合法
            if not re.match(r'^1[3-9]\d{9}$', mobile):
                return http.HttpResponseBadRequest('请输入正确的手机号码')
            # 判断是否勾选用户协议
            if allow != 'on':
                return http.HttpResponseBadRequest('请勾选用户协议')
            # 保存注册数据
            # 这里使用Django认证系统用户模型类提供的create_user()方法创建新的用户。
            # 这里create_user()方法中封装了set_password()方法加密密码。
            try:
                user= User.objects.create_user(username=username, password=password, mobile=mobile)
            except DatabaseError as e:
                logging.error(e)
                return render(request, 'register.html', {'register_errmsg': '注册失败'})

            # 实现状态保持:Django用户认证系统提供了 login() 方法
            # 封装了写入session的操作，帮助我们快速实现状态保持
            login(request, user)
            # 注册成功，重定向到首页
            return redirect(reverse('contents:index'))
            # return render(request, 'index.html')

class UsernameCountView(View):

    def get(self,request,username):
        # 1. 接收用户名
        # 2. 查询数据库,通过查询记录的count来判断是否重复 0表示没有重复 1表示重复
        try:
            count = User.objects.filter(username=username).count()
        except Exception as e:
            logger.error(e)
            return http.JsonResponse({'code':400,'errmsg':'数据库异常'})
        #3.返回相应
        return http.JsonResponse({'code':0,'count':count})