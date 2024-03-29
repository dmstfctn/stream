//const loadTime = new Date();
/* start 10 minutes in */
// const startTime = (new Date(loadTime.getTime() - 600000));

/* start 19 minutes in */
//const startTime = (new Date(loadTime.getTime() - (60000*19)));

/* start 10 sec from the end */
//const startTime = (new Date((loadTime.getTime() - (1184000-10000))));

/* start in 5 seconds */
//const startTime = (new Date(loadTime.getTime() + 5000 ));

const Data = {
  config: {
    //src: "https://vimeo.com/559393481",
    src: "https://vimeo.com/559393481/e71551b38f",
    timing: {      
      streamLength: 1159000 * 3, //19:19 * 3
      loopLength: 1159000,
      endDelay: 10000
    }
  },
  streams: [
    // {
    //   start: startTime.getTime(),
    //   title: `Today, at: ${startTime.getHours()}:${startTime.getMinutes()}:${startTime.getSeconds()}`
    // }, 
    // {   
    //   start: 1623419220000,
    //   title: 'Fri 11 June, 2021 14:47 BST (14:47 CEST)'
    // },
    // to get the time: (new Date('2021-06-23T18:30:00.000Z')).getTime(),
    // {
    //   start: 1624443300000, 
    //   title: 'Wed 23 June, 2021 11:15 BST (12:15 CEST)'
    // },
    // {
    //   start: 1624531200000, 
    //   title: 'Thurs 24 June, 2021 11:40 BST (12:40 CEST)'
    // },
    // {
    //   start: 1624537800000, 
    //   title: 'Thurs 24 June, 2021 13:30 BST (14:30 CEST)'
    // },
    {
      start: 1624471200000, 
      title: 'Wed 23 June, 2021 19:00 BST (20:00 CEST)'
    },
    {      
      start: 1625076000000, //times in ms
      title: 'Wed 30 June, 2021 19:00 BST (20:00 CEST)'
    },
  ]
}

export default Data;