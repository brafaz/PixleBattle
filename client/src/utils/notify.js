
const instance = function(text){
    function splitN(str, N) {
        const words = str.trim().split(/\s+/g);
        const res = [];
        let cur_str = words.shift();
        for (const word of words) {
          if (cur_str.length + 1 + word.length >=N || cur_str.length>=N) {
            res.push(cur_str);
            cur_str = word;
          } else {
            cur_str += ' ' + word;
          }
        }
        res.push(cur_str);
        
        return res.join('\n');
      }
     // alert(text.length)
      var el = document.getElementById('notify');
      el.style.height = text.length+"px"
    //el.insertAdjacentHTML('beforebegin','<div id="notify">'+splitN(text, 20)+'</div>');
    el.innerHTML = splitN(text, 20)
    
    el.style.opacity = "1"
    setTimeout(() => {
        var el = document.getElementById('notify');
        el.style.opacity = "0"
       // el.remove();
    }, 1400);
    return 
}

export default instance