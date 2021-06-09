const getTime = async () => { 
  let response = await fetch('https://time.akamai.com/');      
  if (!response.ok) {
    throw new Error(`getTime() -> HTTP error. status: ${response.status}`);
  }          
  let time = await response.json(); //because json will auto parse a number as a number
  return time * 1000;
} 

export default getTime;