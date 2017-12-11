from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
import coreapi
import json
from django.http import Http404,HttpRequest

# Create your views here.

def index(request):
    return render(request,'dashboard/dashboard.html')   

def showcharts(request):
    return render(request,'dashboard/charts.html')

def showwells(request):
    return render(request,'dashboard/wells.html')