from django.conf.urls import url, include
from rest_framework.urlpatterns import format_suffix_patterns
from . import views

urlpatterns = [
	url(r'^analytics3d$',views.analyticswells, name = "analyticswells"),
	url(r'^analytics2d$',views.analyticswells1, name = "analyticswells1"),
]