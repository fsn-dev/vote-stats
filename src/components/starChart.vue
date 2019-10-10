<template>
  <div class="container">
    <h1>投票展示</h1>
		<div class="flex-bc">
    	<div id="starChart" class="statChart_box statH WW70"></div>
			<div class="statInfo_box statH WW30">
				<h3 class="text-l">总量： {{voteTotal}}</h3>
				<h4 class="text-l Mg0">已投票数：{{statTotal}}</h4>
				<h4 class="text-l Mg0">投票总占比：{{((Number(statTotal) / Number(voteTotal) * 100)).toFixed(2) + '%'}}</h4>
				<dl class="text-l list">
					<dt>{{xAxisName[0]}}</dt>
					<dd><span>票数：</span>{{chartData[0] && chartData[0].stats ? chartData[0].stats : 0}}</dd>
					<dd><span>占比：</span>{{chartData[0] && chartData[0].stats ? (((chartData[0].stats / statTotal) * 100).toFixed(3) + '%') : 0}}</dd>
					<dt>{{xAxisName[1]}}</dt>
					<dd><span>票数：</span>{{chartData[1] && chartData[1].stats ? chartData[1].stats : 0}}</dd>
					<dd><span>占比：</span>{{chartData[1] && chartData[1].stats ? (((chartData[1].stats / statTotal) * 100).toFixed(3) + '%') : 0}}</dd>
					<dt>{{xAxisName[2]}}</dt>
					<dd><span>票数：</span>{{chartData[2] && chartData[2].stats ? chartData[2].stats : 0}}</dd>
					<dd><span>占比：</span>{{chartData[2] && chartData[2].stats ? (((chartData[2].stats / statTotal) * 100).toFixed(3) + '%') : 0}}</dd>
				</dl>
			</div>
		</div>
		<div class="tip_box">
			<h4>方案说明：</h4>
			<dl class="text-l">
				<dt>解决方案1:</dt>
				<dd>主网不分叉，数据不回滚，保持现状。<br>影响范围：被盗账户剩余资金仍然会转移或抛售。</dd>
				<dt>解决方案2:</dt>
				<dd>主网硬分叉(类似以太坊DAO分叉)，指定块高度进行硬分叉，分叉代码禁止除买票之外所有类型交易，间隔一定块高度后（一周），清零被盗账户，剩余391.43万个转移至基金会账户，同时恢复交易。<br>
如果被盗账户在硬分叉之前转移资金，则需要在恢复交易前进行第二次硬分叉，按转移数量扣减被盗账户转移后的账户。<br>
影响范围：被盗账户清零，基金会账户拿回剩余部分被盗资金。 在主网区块高度600000之后，盗账户剩余资金通过DEX、OTC、SWAP、TimeLock等任何类型交易卖出都会被回滚，用户购买的盗币会被清零。</dd>
				<dt>解决方案3:</dt>
				<dd>主网不分叉，数据不回滚，保持现状。<br>影响范围：被盗账户剩余资金仍然会转移或抛售。</dd>
			</dl>
		</div>
  </div>
</template>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container{max-width: 1200px;margin: auto;}
.statH{height: 500px;}
.statChart_box {margin: auto;}
.statInfo_box {color:#333;padding-top: 50px;}
.statInfo_box .list{font-size: 14px;}
.tip_box{width: 80%;margin: auto;}
.tip_box dt{font-weight: 600;font-size: 15px;}
.tip_box dd{font-size: 14px;}
</style>

<script>
const web3 = require('@/assets/js/web3')
export default {
	name: 'starChart',
	data () {
		return {
			chartData: [],
			statTotal: 0,
			voteTotal: 0,
			xAxisName: ['方案一', '方案二', '方案三'],
			statChart: '',
			voteAddr: '0xf4798cc45b0fe0c6a27255745f6977166619bf9615d5d25a0f086e6fb24756aa',
			voteType: 'latest'
		}
	},
  mounted () {
		// console.log(web3)
		this.statChart = echarts.init(document.getElementById('starChart'))
		this.getBalance()
		// this.listenBlock()
    // console.log(this.getBalance())
		// this.barChart('starChart', [], '123')
		let VoteInfo = web3.lilo.fsnGetAsset(this.voteAddr, this.voteType)
		this.voteTotal = web3.fromWei(VoteInfo.Total, 'ether')
		// console.log(web3.lilo.fsnGetAsset(this.voteAddr, this.voteType))
  },
  methods: {
    getBalance () {
			const batch = web3.createBatch()
			batch.add(web3.lilo.fsnGetBalance.request(this.voteAddr, '0x1111111111111111111111111111111111111111', this.voteType))
			batch.add(web3.lilo.fsnGetBalance.request(this.voteAddr, '0x2222222222222222222222222222222222222222', this.voteType))
			batch.add(web3.lilo.fsnGetBalance.request(this.voteAddr, '0x3333333333333333333333333333333333333333', this.voteType))
			batch.requestManager.sendBatch(batch.requests, (err, res) => {
				if (err) {
					console.log(err)
				} else {
					// console.log(res)
					this.chartData = []
					this.statTotal = 0
					for (let i = 0, len = res.length; i < len; i++) {
						let obj = res[i]
						let num = Number(web3.fromWei(obj.result, 'ether'))
						this.statTotal += num
						this.chartData.push({
							nameType: i,
							stats: num,
						})
					}
					this.barChart(this.chartData)
					// console.log(this.statTotal)
					// console.log(this.chartData)
				}
				setTimeout(() => {
					this.getBalance()
				}, 5000)
			})
    },
    barChart (data, type) {
			let maxNum = [...data].sort(this.$$.bigToSmallSort('stats'))[0]
			let option = {
				// color: ['#3bad4b'],
				color: ['#0099ff'],
				tooltip: {
					show: true,
					trigger: 'axis',
					backgroundColor: 'rgba(255,255,255,.8)',
					textStyle: {
						color: '#333',
						fontSize: 10
					},
					borderColor: '#7cb5ec',
					borderWidth: 1,
					formatter: (param) => {
						param = param[0]
						// console.log(param)
						// param = param.data.data
						// console.log(param)
						return [
								param.name + '<hr size=1 style="margin: 3px 0">',
								param.name + ': <span style="font-weight:bold">' + param.data + '</span>',
						].join('')
					}
				},
				xAxis: {
					type : 'category',
					splitNumber: 1,
					scale: false,
					show:true,
					splitLine:{
						show:true
					},
					position:"left",
					data: data.map((item, index) => {
						return this.xAxisName[item.nameType]
					}),
					axisLabel :{
						interval:0,
						rotate:-30
					}
				},
				yAxis: {
					type : 'value',
					splitNumber: 1,
					min: 0,
					scale: true,
					show:true,
					splitLine:{
			　　　　show:true
					}
				},
				series: {
					// name: '投票结果',
					name: data.map((item, index) => {
						return this.xAxisName[item.nameType]
					}),
					type: type ? type : 'bar',
					// type: 'line',
					symbol: 'none',
					// smooth: true,
					barWidth: 60,
					itemStyle: {
						normal: {
							color: (params) => {
								let _c = '#0099ff'
								// console.log(params.value)
								// console.log(maxNum.stats.toFixed(2))
								if (params.value === maxNum.stats.toFixed(2)) {
									_c = 'red'
								}
								// console.log(_c)
								return _c
								// console.log(params)
							}
						}
					},
					label: {
						normal: {
							show: true,
							position: 'top',
							textStyle: {
								color: 'black'
							}
						}
					},
					data: data.map((item, index) => {
						return item.stats.toFixed(2)
					}),
				}
			}
			// myChart.setOption(option)
			this.statChart.setOption(option)
		},
  }
}
</script>
