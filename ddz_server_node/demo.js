

(
  that,
  data,
  function(err,result){
    if(err){
      console.log('RESULT',JSON.stringify(result));
      console.log("playerChuCard cb err:"+err+" "+result)
      _notify("chu_card_res",err,result.data,callindex)
                
    }
     _notify("chu_card_res",err,result.data,callindex)
})


let a = {
  abc:123
}

switch(type){
  case 
}