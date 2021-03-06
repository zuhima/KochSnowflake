/*
MIT License

Copyright (c) 2021 zuhima(TW:@null_cats)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
		//canvasの設定
		var canvas = $("#canvas");
		var ctx = canvas[0].getContext("2d");
		
		//canvasの高さ・幅の設定
		var scale = 500;

		//初期3点の定義(内心が原点の正三角形の頂点)
		var dotA = {x:0, y:250};
		var dotB = {x:125*Math.sqrt(3), y:-125};
		var dotC = {x:-125*Math.sqrt(3), y:-125};

		
		window.onload = function()
		{
			//canvasの大きさ設定
			canvas.attr("width",scale);
			canvas.attr("height",scale);
			
			//座標系設定
			ctx.translate(scale/2, scale/2);
			ctx.scale(1, -1);
			
			//X軸Y軸の描画
			drawLine({x:0, y:-(scale/2)}, {x:0, y:scale/2});
			drawLine({x:-(scale/2), y:0}, {x:scale/2, y:0});
			
			
			//初期正三角形の描画
			drawLine(dotA, dotB);
			drawLine(dotB, dotC);
			drawLine(dotC, dotA);
			
			var level = 0;
			
			//プラスボタンの設定
			$('#plus_button').click(function(){
				
				//ボタンを無効化(描画に時間がかかることがあるため，連続入力を禁止する)
				$('#plus_button').prop("disabled", true);
				$('#minus_button').prop("disabled", true);
				
				
				if(level < 8) level++;  //描画時間の関係でlevelは7まで(見た目もこれ以降そんな変わらない)
				
				$('#level').text(level);
				
				//キャンバス内の描画をクリア
				ctx.clearRect(-scale/2, -scale/2, scale, scale);
			
				//X軸Y軸の描画
				drawLine({x:0, y:-(scale/2)}, {x:0, y:scale/2});
				drawLine({x:-(scale/2), y:0}, {x:scale/2, y:0});
				
				//初期正三角形の描画
				drawLine(dotA, dotB);
				drawLine(dotB, dotC);
				drawLine(dotC, dotA);
				
				//各辺ごとに再帰関数を回す
				calcKohho(level, dotA, dotB);
				calcKohho(level, dotB, dotC);
				calcKohho(level, dotC, dotA);
				
				//ボタンを有効化(描画処理が終わったら有効化)
				$('#plus_button').prop("disabled", false);
				$('#minus_button').prop("disabled", false);
			});
			
			//マイナスボタンの設定
			$('#minus_button').click(function(){
				
				//ボタンを無効化(描画に時間がかかることがあるため，連続入力を禁止する)
				$('#plus_button').prop("disabled", true);
				$('#minus_button').prop("disabled", true);
				
				
				if(level > 0) level--;
				
				$('#level').text(level);
				
				//キャンバス内の描画をクリア
				ctx.clearRect(-scale/2, -scale/2, scale, scale);
			
				//X軸Y軸の描画
				drawLine({x:0, y:-(scale/2)}, {x:0, y:scale/2});
				drawLine({x:-(scale/2), y:0}, {x:scale/2, y:0});
				
				//初期正三角形の描画
				drawLine(dotA, dotB);
				drawLine(dotB, dotC);
				drawLine(dotC, dotA);
				
				//各辺ごとに再帰関数を回す
				calcKohho(level, dotA, dotB);
				calcKohho(level, dotB, dotC);
				calcKohho(level, dotC, dotA);
				
				//ボタンを有効化(描画処理が終わったら有効化)
				$('#plus_button').prop("disabled", false);
				$('#minus_button').prop("disabled", false);
			});
		}
		
		/*線を描画する関数*/
		function drawLine(st, ed)
		{
			ctx.beginPath();
			ctx.moveTo(st.x, st.y);
			ctx.lineTo(ed.x, ed.y);
			ctx.stroke();
		}
		
		/*コッホ雪片を描画する関数*/
		function calcKohho(lv, dotSt, dotEd)
		{
			if(lv <= 0)
			{
				return;
			}
			else
			{
				var midSt = calcMidSt(dotSt, dotEd); //線分(dotSt)(dotEd)を3等分する点(dotSt側)
				var midEd = calcMidEd(dotSt, dotEd); //線分(dotSt)(dotEd)を3等分する点(dotEd側)
				
				calcKohho(lv-1, dotSt, midSt);
				
				//midSt - midEd間の線分を消去？
				clearLine(midSt, midEd);
				var dotAdd = calcEqTri(midSt, midEd);
				drawLine(midSt, dotAdd);
				drawLine(dotAdd, midEd);
				calcKohho(lv-1, midSt, dotAdd);
				calcKohho(lv-1, dotAdd, midEd)
				
				calcKohho(lv-1, midEd, dotEd);
			}
		}
		
		/*線分を1:2に分ける点の座標を計算する関数*/
		function calcMidSt(a, b)
		{
			return {x:(2*a.x/3 + b.x/3), y:(2*a.y/3 + b.y/3)};
		}
		
		/*線分を2:1に分ける点の座標を計算する関数*/
		function calcMidEd(a, b)
		{
			return {x:(a.x/3 + 2*b.x/3), y:(a.y/3 + 2*b.y/3)};
		}
		
		
		/*引数の2点から正三角形を作るもう一点を計算する関数*/
		/*(点stを中心として点edを反時計回りに60度回転した先の座標を計算する)*/
		function calcEqTri(st, ed)
		{
			return {x:((ed.x - st.x)/2 - Math.sqrt(3)*(ed.y - st.y)/2 + st.x), 
					y:(Math.sqrt(3)*(ed.x - st.x)/2 + (ed.y - st.y)/2 + st.y)};
		}
		
		/*線を白で描画する関数*/
		function clearLine(st, ed)
		{
			//描画する線分の色を白に変更
			ctx.strokeStyle = "white";
			
			//元々ある線分の色が透けて見えるので5回くらい重ね掛け
			drawLine(st, ed);
			drawLine(st, ed);
			drawLine(st, ed);
			drawLine(st, ed);
			drawLine(st, ed);
			
			//描画する線分の色を黒に変更
			ctx.strokeStyle = "black";
		}