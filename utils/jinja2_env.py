# -*- coding: utf-8 -*-
"""
@author: 小佐料
@time: 2022/3/25 上午10:13 
@content: 
"""

from django.contrib.staticfiles.storage import staticfiles_storage
from django.urls import reverse
from jinja2 import Environment


def jinja2_environment(**options):
    env = Environment(**options)
    env.globals.update({
        'static': staticfiles_storage.url,
        'url': reverse,
    })
    return env