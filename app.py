from flask import Flask, render_template, request, flash, redirect, jsonify
import  csv, datetime
from math import nan
import requests

import os

# decouple for hiding secret key. You need to create a .env file and put your keys there. also add the .env to gitignore
from decouple import config

from binance.client import Client
from binance.enums import *

api_key = config('KEY')
api_secret = config('SECRET')


app = Flask(__name__)

client = Client(api_key, api_secret)



@app.route('/')
def index():
    title = 'CoinView'

    account = client.get_account()

    balances = account['balances']

    exchange_info = client.get_exchange_info()
    symbols = exchange_info['symbols']

    return render_template('index.html', title=title, my_balances=balances, symbols=symbols)


@app.route('/buy', methods=['POST'])
def buy():
    print(request.form)
    try:
        order = client.create_order(symbol=request.form['symbol'], 
            side=SIDE_BUY,
            type=ORDER_TYPE_MARKET,
            quantity=request.form['quantity'])
    except Exception as e:
        flash(e.message, "error")

    return redirect('/')


@app.route('/sell')
def sell():
    return 'sell'


@app.route('/settings')
def settings():
    return 'settings'

@app.route('/history')
def history():
    candlesticks = client.get_historical_klines("DOTUSDT", Client.KLINE_INTERVAL_15MINUTE, "1 Dec, 2022")

    processed_candlesticks = []

    for data in candlesticks:
        candlestick = { 
            "time": data[0] / 1000, 
            "open": data[1],
            "high": data[2], 
            "low": data[3], 
            "close": data[4]
        }

        processed_candlesticks.append(candlestick)

    return jsonify(processed_candlesticks)
