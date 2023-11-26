var chart = LightweightCharts.createChart(document.getElementById('chart'),{
	
	layout: {
		backgroundColor: '#000000',
		textColor: 'rgba(255, 255, 255, 0.9)',
	},
	priceScale: {
		borderColor: 'rgba(197, 203, 206, 0.8)',
	},
	timeScale: {
		borderColor: 'rgba(197, 203, 206, 0.8)',
		timeVisible: true,
		secondsVisible: true,
	},
});
//var chart1 = LightweightCharts.createChart(document.getElementById('chart1'));

var lineSeries1 = chart.addLineSeries({ color: '#ff0000' });
var lineSeries = chart.addLineSeries({ color: '#2962FF' });



//var candleSeries = chart.addCandlestickSeries({
	//upColor: '#00ff00',
	//downColor: '#ff0000', 
	//borderDownColor: 'rgba(255, 144, 0, 1)',
	//borderUpColor: 'rgba(255, 144, 0, 1)',
	//wickDownColor: 'rgba(255, 144, 0, 1)',
	//wickUpColor: 'rgba(255, 144, 0, 1)',
//});

fetch('http://localhost:5000/history')
	.then((r) => r.json())
	.then((response) => {
		console.log(response)

		
		
		lineSeries.setData(response);
		lineSeries1.setData(response);
	})

const fruits = [];
var stats = [];
const resistance =[];
const support =[];
var r=NaN;
var s=NaN;
var timeo = NaN;
var period = [];
var openo = [];
var h_max =NaN;
var l_min = NaN;
var diff =NaN
var pric = 0;
var op=0;
var open_value=NaN;
open_time = NaN;
var fruit_time=[];



var binanceSocket = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@aggTrade")//"wss://stream.binance.com:9443/ws/btcusdt@kline_15m");

binanceSocket.onmessage = function (event) {	
	var message = JSON.parse(event.data);
	fruits.push(Number(message.p));
	
	//if (isNaN(first_p)){
		//first_p=Number(message.p)
	//}
	var candlestick = message; //var candlestick = message.k;
	fruit_time.push(candlestick.E);
	period.push(Math.trunc((candlestick.E/60000)%60));


	//console.log(candlestick)
	if (fruits.length > 1) {
		if  ((isNaN(r)) && (Math.min(fruits[fruits.length-2],Number(candlestick.p))!= Math.max(fruits[fruits.length-2],Number(candlestick.p)))){
			r=Math.max(fruits[fruits.length-2],Number(candlestick.p));
			s=Math.min(fruits[fruits.length-2],Number(candlestick.p));
		}

		if  ((!isNaN(r)) && (Math.min(fruits[fruits.length-2],Number(candlestick.p))!= Math.max(fruits[fruits.length-2],Number(candlestick.p)))){
			r=Math.max(fruits[fruits.length-2],Number(candlestick.p));
			s=Math.min(fruits[fruits.length-2],Number(candlestick.p));
		}


		if (!isNaN(r)){ 
			resistance.push(r);
			support.push(s);
			
		}

		if ((resistance.length  >1) && ((resistance[resistance.length-1])>(resistance[resistance.length-2])) && ((support[support.length-1])>(support[support.length-2]))){
			stats.push(1)
		}

		if ((resistance.length  >1) && ((resistance[resistance.length-1])<(resistance[resistance.length-2])) && ((support[support.length-1])<(support[support.length-2]))){
			stats.push(0)
		}

		if ((stats.length  >1) && ((stats[stats.length-1])!== (stats[stats.length-2]))){
			//timeo = candlestick.E/1000;
			open_value=fruits[fruits.length - 2];
			open_time =fruit_time[fruit_time.length-2];
			openo.push(fruits[fruits.length - 2]);
			//h_max = Math.max(openo,Number(candlestick.p));
			//l_min = Math.min(openo,Number(candlestick.p));
			//candleSeries.update({
				//time: timeo ,
				//open: openo,
				//close: Number(candlestick.p),
				//high: h_max,
				//low: l_min,
				
			}
			//if (openo.length  >1){
				//timeo = candlestick.E/1000;
				//diff =(openo[openo.length-1] - openo[openo.length-2]);
				//pric = pric + diff;
				//real_p = first_p + pric;
				//h_max = Math.max(openo,Number(candlestick.p));
				//l_min = Math.min(openo,Number(candlestick.p));
				//lineSeries.update({
					//time: candlestick.E/1000,
					//value: pric,
					//close: Number(candlestick.p),Q	1Q`	
					//high: h_max,
					//low: l_min,
					
				//})
		
		}
		if (!isNaN(open_value)){ 
			op_diff = (Number(candlestick.p)-open_value)/Math.log(candlestick.E-open_time);
			op = (op + op_diff);
			lineSeries1.update({
				time: candlestick.E/1000,
				value: op,
					})
			}


		//if ((period.length  >1) && ((period[period.length-1])== (period[period.length-2]))){
			//h_max=Math.max(h_max,Math.max(openo,Number(candlestick.p)));
			//l_min=Math.min(l_min,Math.min(openo,Number(candlestick.p)))
			//candleSeries.update({
				//time: timeo ,
				//open: openo,
				//close: Number(candlestick.p),
				//high:h_max ,
				//low: l_min,
		
		//})

		}

	
 
if (fruits.length >4){
		fruits.shift();
		fruit_time.shift();
		
		
		
}
if (openo.length >1){
	openo.shift();
	
	
	
}






window.addEventListener("resize", () => {
	chart.resize(window.innerWidth, window.innerHeight);
	//chart1.resize(window.innerWidth, window.innerHeight);
  });