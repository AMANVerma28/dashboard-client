from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
import coreapi
import json
from django.http import Http404,HttpRequest

# Create your views here.

#View for Analytics Wells.
def analyticswells(request):
    return render(request,'analytics/wells.html')

def analyticswells1(request):
    return render(request,'analytics/wells1.html')	