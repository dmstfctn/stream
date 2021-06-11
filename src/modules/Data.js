const loadTime = new Date();

/* start 10 minutes in */
const startTime = (new Date(loadTime.getTime() - 600000));

/* start 20 sec from the end */
//const startTime = (new Date((loadTime.getTime() - (1184000-20000))));

/* start in 5 seconds */
//const startTime = (new Date(loadTime.getTime() + 5000 ));

const Data = {
  config: {
    src: "https://vimeo.com/559393481",
    timing: {      
      streamLength: 1184000, //19:44
    }
  },
  streams: [
    {
      start: startTime.getTime(),
      title: `Today, at: ${startTime.getHours()}:${startTime.getMinutes()}:${startTime.getSeconds()}`
    },    
    // to get the time: (new Date('2021-06-23T18:30:00.000Z')).getTime(),
    {
      start: 1624473000000, 
      title: 'Wed 23 June, 2021 19:30 BST (20:30 CEST)'
    },
    {      
      start: 1625086800000, //times in ms
      title: 'Wed 30 June, 2021 19:30 BST (20:30 CEST)'
    },
  ]
}

export default Data;