from django.urls import re_path

from apps.verifications import views

urlpatterns = [
    re_path(r'^image_codes/(?P<uuid>[\w-]+)/$', views.ImageCodeView.as_view(), name='image_codes'),

]
