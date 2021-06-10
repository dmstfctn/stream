const loadTime = new Date();
const startTime = (new Date(loadTime.getTime() - 10000));

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
    // {
    //   start: 1622475900000,
    //   title: 'Monday 31 May, 2021. 17:45–17:47 CET (16:45–15:47 BST)'
    // },
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