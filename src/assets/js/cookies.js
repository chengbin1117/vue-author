
//设置Cookie
const setCookie = (c_name,value) => {
  var date=new Date();
  var expiresDays=10;
  //将date设置为10天以后的时间
  date.setTime(date.getTime()+expiresDays*24*3600*1000);
 document.cookie=c_name+ "=" +escape(value) +";expires=" + date.toGMTString() +""+";domain=.kg.com"+";path=/"
//  document.cookie=c_name+ "=" +escape(value) +";expires=" + date.toGMTString() +""+""+";path=/"
}

//取Cookie
const getCookie = (objName) => {
    var arrStr = document.cookie.split("; ");
    for (var i = 0; i < arrStr.length; i++) {
        var temp = arrStr[i].split("=");
        if (temp[0] == objName)
            return unescape(temp[1]);
    }
}

//删除cookies
const delCookie =(name) =>{//为了删除指定名称的cookie，可以将其过期时间设定为一个过去的时间
    var date= new Date();
　　date.setTime(date.getTime() - 1);
　　var cval = name;
　　if(cval != null)
　　document.cookie = name + "=" + cval + ";expires=" + date.toGMTString() +";domain=.kg.com"+ ";path=/";
    // document.cookie = name + "=" + cval + ";expires=" + date.toGMTString() +""+ ";path=/";
}

export default {
    setCookie,
    getCookie,
    delCookie
}
