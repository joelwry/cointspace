document.addEventListener("DOMContentLoaded", function(){

// retrieving coin id name from window url
var param = new URLSearchParams(window.location.search)
const coin_id = JSON.parse(param.get('coin_id'))
const coin_rate = JSON.parse(param.get("coin_rate"))
const coin_img = JSON.parse(param.get('coin_img'))
let anime_container = document.querySelector(".spaceship_container");

// retrieving dom element for useage
section_form = document.getElementById("form8-x");
radio_field = section_form.querySelectorAll(".radio_label")
coin_rate_div = document.querySelector(".coin_rate_div")
page_header = document.querySelector(".chart_page_header");
coin_image = document.querySelector(".coin_img");

// getting canvas object for chart 
var ctx = document.getElementById('myChart1').getContext('2d');

// adding content to dom element
if(coin_rate === null){
    coin_rate_div.innerHTML = `<strong></strong>`
}else{
    coin_rate_div.innerHTML = `<strong>${coin_rate}</strong>`
}
if(coin_id === null){
    page_header.innerHTML = `<strong>Chart</strong>`
}else{
    page_header.innerHTML = `<strong>${coin_id+" trend"}</strong>`
}
if(coin_img !== null){
    coin_image.src = coin_img;
}

// array object for storing fetch data for chart
price_traded_at = []
coin_volume_traded = []
coin_spread = []

createChart = (spread,data, chart_type)=> {new Chart(ctx, {
    type: chart_type,
    data: {
        labels: spread,
        datasets: 
        [
           
            {
                label: 'Price Variation',
                data: data,
                backgroundColor: 
                    'rgba(45,55,86,0.86)',
                borderColor: 
                    'rgba(233, 236, 192, 0.6)',
                borderWidth: 1
            }
        ]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
              
            },
            x: {
                beginAtZero: true
              }
        },
        title:{
            display:true,
            text:coin_id,
            fontSize: 28
            },
           
    }
});
}

// adding an event listener for radio toggle button
radio_field.forEach((e)=>{
    
    e.firstElementChild.addEventListener('click',(p)=>{
        if(p.target.value === "line"){
           createChart(coin_volume_traded, price_traded_at,"line")
         
        }else if(p.target.value ==="radar"){
            createChart(price_traded_at, coin_volume_traded,"radar") 
        }else if(p.target.value ==="bar"){
            createChart(coin_volume_traded, price_traded_at, "bar") 
        }else if(p.target.value ==="volume"){
            createChart(price_traded_at, coin_volume_traded,"line") 
        }
    })
})


//preparing fetch option for api call
var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };

  
// main api call  
fetch("https://api.coinstats.app/public/v1/charts?period=1m&coinId="+coin_id, requestOptions).then(response => response.json())
    .then(result => {
        let coin_chart = result.chart
       

        coin_chart.forEach((e)=>{
            coin_volume_traded.push(e[0])
            price_traded_at.push(Number(e[1].toFixed(3)))
            coin_spread.push(Number(e[2].toFixed(3)))
        })             
      // createChart(coin_volume_traded);
      createChart(coin_volume_traded, price_traded_at,"line");
      anime_container.style.display = "none";
    })
    .catch(error => {
        let h4 = document.querySelector(".coin_data_state");
        h4.innerText = "Refresh to load chart";
    });
  

});


