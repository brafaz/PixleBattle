function closedial(){
  var el = document.getElementById('dialogbckg');
  el.remove()
}
const gialog = function(text,type,fun,ok){
     // alert(text.length)
    document.body.insertAdjacentHTML('afterbegin','<div id="dialogbckg"><div id="dialog"><p id="dialogtext"></p><button id="dialogok">'+ok+'</button><button id="dialogclose">Закрыть</button></div></div>');
    if(type == 1){
     var el = document.getElementById('dialog');
     el.insertAdjacentHTML('beforeend','</p><input id="dialoginput" maxLength={"30"} placeholder="194034535"></input>');
     var ok = document.getElementById('dialogok');
     ok.addEventListener('click',()=>{
      var inpt = document.getElementById('dialoginput').value;
      if(inpt.length< 1 || inpt ==''){
        alert("Поле ввод пустое или текст слишком короткий!")
        return
      }
      fun(inpt)
     })
    
    }else{
      var ok = document.getElementById('dialogok');
      ok.addEventListener('click',()=>{
        closedial()
        fun()
      })
    }
    var textd = document.getElementById('dialogtext');
    var close = document.getElementById('dialogclose');
   
    //var bckg = document.getElementById('dialogbckg');
    textd.innerHTML = text
    close.addEventListener('click',closedial)
   
    return 
}

export default gialog