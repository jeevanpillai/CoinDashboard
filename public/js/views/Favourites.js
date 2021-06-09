import AbstractView from "./AbstractView.js";

export default class extends AbstractView{
    constructor(params) {
        super(params);
        this.setTitle("Favourites")
    }

    async getHtml(x) {
        var title = document.createDocumentFragment();
        document.getElementById("title").innerHTML = "";
        var h1 = document.createElement("h1");
        h1.appendChild(document.createTextNode("Favourites"))
        title.appendChild(h1);
        document.getElementById("title").appendChild(title);
        var tree = document.createDocumentFragment();

        if(favs.length<1){
            document.getElementById("app").innerHTML = "";
            var p = document.createElement("p");
            p.appendChild(document.createTextNode("No Favourites Have Been Added!"))
            tree.appendChild(p);
            document.getElementById("app").appendChild(tree);
            return;
        }

        let response = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&sparkline=true&per_page="+String(x));
        let data = await response.json();

        var nf = new Intl.NumberFormat();
        var c_spark = new Array(favs.length)
        var c_name = new Array(favs.length)
        var c_id = new Array(favs.length)

        var headers = ["Last Price (USD)", "24 Hour Change (%)", "Volume (USD)"];
        var head_tag = ["current_price","price_change_percentage_24h", "total_volume"];

        var i=0;
        var store = 0
        for (i=0; i<x; i++){
            if(favs.includes(data[i]["symbol"])){
                c_spark[store] = data[i]["sparkline_in_7d"]["price"];
                c_name[store] = data[i]["name"];
                c_id[store] = "chart_"+String(data[i]["symbol"]);

                var card = document.createElement("div");
                card.setAttribute("class", "card");
                var cont = document.createElement("div");
                cont.setAttribute("class", "container");

                var h4 = document.createElement("h4");
                h4.appendChild(document.createTextNode(data[i]["name"] + " (" + String(data[i]["symbol"]).toUpperCase() + ")"));

                var btn = document.createElement("button");
                btn.setAttribute("type", "button");
                    var icon = document.createElement("i");
                    icon.setAttribute("class", "fa fa-bookmark");
                    icon.setAttribute("id", "btn_"+String(data[i]["symbol"]));
                    btn.appendChild(icon);
                if(favs.includes(String(data[i]["symbol"])))
                    btn.setAttribute("class", "button_pressed");
                else
                    tn.setAttribute("class", "button");
                btn.setAttribute("id", "btn_"+String(data[i]["symbol"]));

                //<canvas id="myChart" width="400" height="400"></canvas>
                var canvas = document.createElement("canvas");
                canvas.setAttribute("id", c_id[store]);
                canvas.setAttribute("width", "400");
                canvas.setAttribute("height", "200");

                var table = document.createElement("table");
                table.setAttribute("class", "cardtable");
                
                var j=0
                for(j = 0; j<headers.length; j++){
                    var tr = document.createElement("tr");
                        var td0 = document.createElement("td");
                        td0.setAttribute("class", "att");
                        td0.appendChild(document.createTextNode(headers[j]));
                        tr.appendChild(td0);

                        var td1 = document.createElement("td");
                        td1.appendChild(document.createTextNode(nf.format(data[i][head_tag[j]])));
                        tr.appendChild(td1);

                    table.appendChild(tr);
                }
                cont.appendChild(h4);
                cont.appendChild(btn);
                cont.appendChild(canvas)
                cont.appendChild(table);
                card.appendChild(cont);
                tree.appendChild(card);
                store++;      
            }    
        }
           
        document.getElementById("app").innerHTML = "";
        document.getElementById("app").appendChild(tree);

        var reply_click = (coinid) => {
            var val = String(coinid.path[0].id).substring(String(coinid.path[0].id).indexOf("_")+1)
            console.log(coinid.path[0].id)
            if(!favs.includes(val)){
                favs.push(val)
                document.getElementById("btn_"+String(val)).className = "button_pressed"
            }else{
                const index = favs.indexOf(val);
                if (index > -1) {
                    favs.splice(index, 1);
                }
                document.getElementById("btn_"+String(val)).className = "button"
            }
            console.log(favs)
            this.getHtml(x);
        }

        i=0;
        console.log(c_name, c_id);
        for(i=0; i<c_id.length; i++){
            await this.displayCharts(c_spark[i], c_name[i], c_id[i]);
            console.log(c_name[i], c_id[i]);
            document.getElementById("btn_"+String(favs[i])).onclick = reply_click;
        }

        return;
    }

    async displayCharts(spark, name, id){
        var ctx = document.getElementById(id);
        var bottom = new Array(spark.length)
        bottom.fill("");
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: bottom,
                datasets: [{
                  label: name,
                  data: spark,  
                  fill: false,
                  borderColor: 'rgb(75, 192, 192)',
                  tension: 0.1
                }]
              },
            options:{
                elements: {
                    point:{
                        radius: 1.2
                    }
                },
                plugins:{
                    legend:{
                        display: true,
                        labels:{
                            boxWidth: 0,
                            boxHeight: 0 
                        }
                    }
                },
                interaction:{
                    mode: 'nearest'
                },  
                scales: {
                    xAxes: [{
                        ticks: {
                            display: false //this will remove only the label
                        }
                    }]
                }
            }
        });
    }
}