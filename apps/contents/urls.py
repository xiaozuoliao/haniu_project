from django.urls import path, re_path
from apps.contents import views

urlpatterns = [

    re_path(r'^$', views.IndexView.as_view(), name='index'),

]
