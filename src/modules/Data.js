//const loadTime = new Date();
//const startTime = (new Date(loadTime.getTime() + 20000));

const Data = {
  config: {
    src: "https://vimeo.com/556605464",
    timing: {
      // streamLength: 1800000, //30min
      // leadIn: 1800000, //30min
      streamLength: 123000, //2:03
      leadIn: 10000, //10sec
    }
  },
  streams: [
    // {
    //   start: startTime.getTime(),
    //   title: `Today, at: ${startTime.getHours()}:${startTime.getMinutes()}:${startTime.getSeconds()}`
    // },
    // {
    //   start: 1622475900000,
    //   title: 'Monday 31 May, 2021. 17:45–17:47 CET (16:45–15:47 BST)'
    // },
    // to get the time: (new Date('2021-06-23T18:30:00.000Z')).getTime(),
    {
      start: 1624473000000, 
      title: 'Wed 23 June, 2021 19:30 BST (20:30 CET)'
    },
    {      
      start: 1625086800000, //times in ms
      title: 'Wed 30 June, 2021 21:00 BST (22:00 CET)'
    },
  ]
}

Data.streams = Data.streams.map(( stream ) => {
  return {
    ...stream,
    leadInStart: stream.start - Data.config.timing.leadIn
  }
});

export default Data;