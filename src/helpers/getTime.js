const getTime = async () => { 
  //let response = await fetch('https://time.akamai.com/');      
  try{
    let response = await fetch('https://oliversmith.cc/dev/time.php');         
    let time = await response.json(); //because json will auto parse a number as a number
    return time * 1000;
  } catch(e) {
    console.log('getTime() -> fetch error -> ', e );
    return (new Date()).getTime();
  }
} 

export default getTime;