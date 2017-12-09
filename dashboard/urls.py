from django.conf.urls import url, include
from rest_framework.urlpatterns import format_suffix_patterns
from . import views

urlpatterns = [
	url(r'^dashboard$',views.index, name = "index"),
	url(r'^charts$',views.showcharts, name = "showcharts"),
	url(r'^well$',views.showwells, name = "showwells"),
]