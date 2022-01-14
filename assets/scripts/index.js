document.addEventListener("DOMContentLoaded", function(){

let crypto_card_dashboard = document.querySelector("#crypto_card_list")
let crypto_card_news = document.querySelector("#crypto_card_news")
let anime_container = document.querySelector(".spaceship_container");



//creating card item function which accept a json body response as it data source for displaying coins
const cardItem = (data) =>{
    let main_div = 
        `
        <div class="col-6 col-md-4 col-lg-4">
                        
        <div class="card-wrapper">
            <div class="card-box align-center">
                <div class="crypto_data crypto_img_name">
                    <img class="coin_img" src=${data.icon}> 
                    
                    <span class="text-warning bg-dark coin_id">${data.id}</span> 
                </div> 
                <div class="crypto_data crypto_value">
                    <h4 class="card-title align-center mbr-black mbr-fonts-style display-7 dollar_price"><strong>${"$"+data.price.toFixed(2)}</strong></h4>
                    <p class="text-primary">${data.priceChange1d}</p> 
               </div>                              
               <div>
                    <p class="text-warning bg-dark fs-2 fw-bold coin_price">${data.priceBtc.toFixed(7)+ data.symbol.toLowerCase()}</p>  
               </div>
                    <button type="submit" class="btn btn-primary display-4" style="width: inherit; margin-top:-2px">
                         Trend
                    </button>
                
            </div>
        </div>
    </div>
       
        `
    return main_div
}


//creating card news that accept a data object

const cardNews=(data, index)=>{
    let news_div = 
        `
            <div class="col-12 col-md-6 col-lg-3">
                <div class="card-wrapper">
                    <div class="card-box align-center">
                        <span class="text-warning bg-dark">${"0"+index}</span>
                        <h4 class="card-title align-center mbr-black mbr-fonts-style display-7">
                            <strong>${data.title}</strong>
                        </h4>
                        <p class="fs-3 fw-light">
                            ${data.description} 
                        </p>
                        <div class="mbr-section-btn card-btn align-center">
                            <a class="btn btn-primary display-7" href=${data.link} target="_blank">read
                                </a>
                        </div>
                        <span class="bg-yellow fs-6">source: <span class="text-success">${data.source}</span></span>
                       
                    </div>
                </div>
            </div>

        `
    return news_div;
}


var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  

    // api call for fetching news 
fetch('https://api.coinstats.app/public/v1/news/trending?skip=0&limit=3', requestOptions).then(response=>
    response.json()).then(result => {
    for(var index in result.news){
        count = Number(index) + 1;
        let news = cardNews(result.news[index], count)
        crypto_card_news.innerHTML += news;
    }
}).catch(error =>console.log('error', error))


  //api fetching of coins to be displayed inside carditem
fetch("https://api.coinstats.app/public/v1/coins?skip=0&limit=21", requestOptions)
    .then(response => response.json())
        .then(result => {
            for(var index in result.coins){
            let card_data = cardItem(result.coins[index])
            crypto_card_dashboard.innerHTML += card_data
        }
        anime_container.style.display = "none";
    })
    .catch(error => {
        let h4 = document.querySelector(".coin_data_state");
        h4.innerText = "Refresh to load crypto coins";
    });



// adding event listener to button for directing to chart tab utilizing coin id 
crypto_card_dashboard.addEventListener('click', (e)=>{
    if(e.target.className==="btn btn-primary display-4"){
            var coin_id_obj = e.target.parentElement.getElementsByClassName("coin_id")[0].outerText;
            var coin_rate = e.target.parentElement.getElementsByClassName("dollar_price")[0].outerText +"/"+
                e.target.parentElement.getElementsByClassName("coin_price")[0].outerText ;
            var coin_img =  e.target.parentElement.getElementsByClassName("coin_img")[0].src
            var param = new URLSearchParams();
            param.append("coin_id", JSON.stringify(coin_id_obj));
            param.append("coin_rate", JSON.stringify(coin_rate))
            param.append("coin_img", JSON.stringify(coin_img))
            var url = "./chart.html?"+param.toString();
            location.href = url;      
    }
})

})